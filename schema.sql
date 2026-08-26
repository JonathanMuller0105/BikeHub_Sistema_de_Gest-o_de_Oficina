-- ============================================================
-- SCRIPT DE CRIAÇÃO E POVOAMENTO DO BANCO DE DADOS - BIKEHUB
-- Sistema de Gestão de Oficina, Vendas e Aluguel de Bicicletas
-- SGBD: MySQL 8.0+ / MariaDB 10.5+
-- ============================================================

-- Criação do schema do banco de dados caso não exista
CREATE DATABASE IF NOT EXISTS `bikehub`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `bikehub`;

-- Desabilita temporariamente a verificação de chaves estrangeiras para permitir recriação limpa
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. TABELA DE USUÁRIOS DO SISTEMA (Autenticação Administrativa)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `usuario`;
CREATE TABLE `usuario` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único do usuário no sistema',
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Nome de usuário único para login (ex: Admin1234)',
  `senha` VARCHAR(100) NOT NULL COMMENT 'Senha de acesso do usuário (em produção deve ser hasheada com BCrypt)',
  `nome_completo` VARCHAR(100) NOT NULL COMMENT 'Nome completo do operador ou administrador',
  `perfil` VARCHAR(20) NOT NULL DEFAULT 'ADMIN' COMMENT 'Papel do usuário no sistema (ADMIN, ATENDENTE, MECANICO)',
  `ativo` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Indica se o usuário está ativo para autenticação',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora de criação do registro'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tabela responsável pela autenticação e controle de operadores do BikeHub';

-- Índice para agilizar a busca de login por username
CREATE INDEX `idx_usuario_username` ON `usuario` (`username`);

-- ------------------------------------------------------------
-- 2. TABELA DE CLIENTES
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `cliente`;
CREATE TABLE `cliente` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único do cliente',
  `nome` VARCHAR(120) NOT NULL COMMENT 'Nome completo do cliente',
  `telefone` VARCHAR(20) NOT NULL COMMENT 'Telefone de contato no formato brasileiro (XX) XXXXX-XXXX',
  `email` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Endereço de e-mail do cliente para notificações e OS',
  `cpf` VARCHAR(14) DEFAULT NULL COMMENT 'CPF opcional do cliente para fins fiscais',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de cadastro do cliente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Cadastro de clientes da oficina, compradores e locatários';

-- Índice para buscas por e-mail e telefone
CREATE INDEX `idx_cliente_email` ON `cliente` (`email`);
CREATE INDEX `idx_cliente_telefone` ON `cliente` (`telefone`);

-- ------------------------------------------------------------
-- 3. TABELA DE BICICLETAS DOS CLIENTES (Para Oficina / Manutenção)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `bicicleta`;
CREATE TABLE `bicicleta` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único da bicicleta do cliente',
  `cliente_id` BIGINT NOT NULL COMMENT 'Chave Estrangeira: Referência ao proprietário da bicicleta na tabela cliente',
  `marca` VARCHAR(50) NOT NULL COMMENT 'Marca do fabricante (ex: Caloi, Trek, Specialized, Sense)',
  `modelo` VARCHAR(80) NOT NULL COMMENT 'Modelo da bicicleta (ex: Elite Carbon, Rockhopper, Explorer)',
  `cor` VARCHAR(30) NOT NULL COMMENT 'Cor predominante da bicicleta',
  `ano` INT NOT NULL COMMENT 'Ano de fabricação do quadro ou modelo',
  `numero_serie` VARCHAR(50) DEFAULT NULL COMMENT 'Número de série do chassi para segurança',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de registro da bicicleta no sistema',
  CONSTRAINT `fk_bicicleta_cliente` FOREIGN KEY (`cliente_id`)
    REFERENCES `cliente` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bicicletas pertencentes aos clientes para histórico e ordens de serviço';

-- Índice na chave estrangeira para performance em JOINs de cliente e suas bicicletas
CREATE INDEX `idx_bicicleta_cliente_id` ON `bicicleta` (`cliente_id`);

-- ------------------------------------------------------------
-- 4. TABELA DE ORDENS DE SERVIÇO (Oficina Mecânica)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `servico`;
CREATE TABLE `servico` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único da Ordem de Serviço (OS)',
  `cliente_id` BIGINT NOT NULL COMMENT 'Chave Estrangeira: Cliente solicitante do serviço',
  `bicicleta_id` BIGINT NOT NULL COMMENT 'Chave Estrangeira: Bicicleta a ser reparada/revisada',
  `descricao` TEXT NOT NULL COMMENT 'Descrição detalhada do defeito, peças a trocar e serviços solicitados',
  `valor` DECIMAL(10, 2) NOT NULL COMMENT 'Valor total orçado/cobrado pelo serviço em Reais (R$)',
  `data_abertura` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data e hora da abertura da Ordem de Serviço',
  `data_entrega` DATE NOT NULL COMMENT 'Data prometida para conclusão e entrega ao cliente',
  `status` ENUM('PENDENTE', 'EM_ANALISE', 'EM_MANUTENCAO', 'PRONTO_PARA_RETIRADA', 'ENTREGUE')
    NOT NULL DEFAULT 'PENDENTE' COMMENT 'Status atual do ciclo de vida da OS na oficina',
  CONSTRAINT `fk_servico_cliente` FOREIGN KEY (`cliente_id`)
    REFERENCES `cliente` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_servico_bicicleta` FOREIGN KEY (`bicicleta_id`)
    REFERENCES `bicicleta` (`id`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Ordens de serviço para manutenção de bicicletas na oficina mecânica';

-- Índices para agilizar relatórios por status e buscas por cliente
CREATE INDEX `idx_servico_status` ON `servico` (`status`);
CREATE INDEX `idx_servico_cliente_id` ON `servico` (`cliente_id`);
CREATE INDEX `idx_servico_bicicleta_id` ON `servico` (`bicicleta_id`);
CREATE INDEX `idx_servico_data_entrega` ON `servico` (`data_entrega`);

-- ------------------------------------------------------------
-- 5. TABELA DE CATÁLOGO DE BICICLETAS (Vendas Semi-Novas e Aluguel)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `bicicleta_catalogo`;
CREATE TABLE `bicicleta_catalogo` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT 'Identificador único da bicicleta no catálogo comercial',
  `marca` VARCHAR(50) NOT NULL COMMENT 'Marca da bicicleta (ex: Scott, Cannondale, Caloi, Oggi)',
  `modelo` VARCHAR(80) NOT NULL COMMENT 'Modelo da bicicleta (ex: Aspect 940, Trail 6, Big Wheel 7.2)',
  `cor` VARCHAR(30) NOT NULL COMMENT 'Cor do acabamento',
  `ano` INT NOT NULL COMMENT 'Ano de fabricação',
  `faixa_etaria` ENUM('INFANTIL', 'JUVENIL', 'ADULTO') NOT NULL COMMENT 'Segmento de tamanho e faixa etária',
  `tipo_operacao` ENUM('VENDA', 'ALUGUEL') NOT NULL COMMENT 'Destinação comercial: VENDA (semi-nova) ou ALUGUEL (diária)',
  `valor` DECIMAL(10, 2) NOT NULL COMMENT 'Preço de venda total (se VENDA) ou valor da diária (se ALUGUEL)',
  `disponivel` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Indica se a bicicleta está disponível para compra imediata ou locação',
  `imagem_url` VARCHAR(255) DEFAULT NULL COMMENT 'URL ou caminho da foto da bicicleta',
  `descricao` VARCHAR(255) DEFAULT NULL COMMENT 'Breve descrição sobre o estado e especificações da bicicleta',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de inclusão no catálogo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Catálogo de estoque para comercialização de semi-novas e frota de locação';

-- Índices para filtragem rápida por faixa etária, tipo de operação e disponibilidade
CREATE INDEX `idx_catalogo_faixa_tipo` ON `bicicleta_catalogo` (`faixa_etaria`, `tipo_operacao`, `disponivel`);
CREATE INDEX `idx_catalogo_tipo_operacao` ON `bicicleta_catalogo` (`tipo_operacao`);

-- Reabilita a checagem de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- POVOAMENTO INICIAL DE DADOS (INSERTS DE EXEMPLO)
-- ============================================================

-- Inserção do Usuário Administrador Padrão exigido
-- Credenciais: Usuário = Admin1234 / Senha = Admin123456
INSERT INTO `usuario` (`username`, `senha`, `nome_completo`, `perfil`, `ativo`)
VALUES ('Admin1234', 'Admin123456', 'Administrador BikeHub', 'ADMIN', TRUE);

-- Inserção de Clientes de Exemplo
INSERT INTO `cliente` (`nome`, `telefone`, `email`, `cpf`) VALUES
('Carlos Eduardo Silveira', '(11) 98765-4321', 'carlos.silveira@email.com', '123.456.789-00'),
('Mariana Ferreira Costa', '(21) 99123-8877', 'mariana.costa@email.com', '234.567.890-11'),
('Roberto Rocha Lima', '(31) 98456-1122', 'roberto.rocha@email.com', '345.678.901-22'),
('Fernanda Albuquerque', '(41) 97654-9988', 'fernanda.albuquerque@email.com', '456.789.012-33');

-- Inserção de Bicicletas dos Clientes
INSERT INTO `bicicleta` (`cliente_id`, `marca`, `modelo`, `cor`, `ano`, `numero_serie`) VALUES
(1, 'Caloi', 'Explorer Pro 29', 'Azul Metálico', 2022, 'CLX-2022-9981'),
(1, 'Specialized', 'Allez Elite Road', 'Vermelho', 2021, 'SPZ-8827-0012'),
(2, 'Trek', 'Marlin 7', 'Laranja / Preto', 2023, 'TRK-2023-4411'),
(3, 'Sense', 'Impact Evo Carbon', 'Grafite Fosco', 2022, 'SNS-7731-9021'),
(4, 'Oggi', 'Hacker HDS', 'Verde Neon', 2023, 'OGG-9901-3322');

-- Inserção de Ordens de Serviço (Oficina)
INSERT INTO `servico` (`cliente_id`, `bicicleta_id`, `descricao`, `valor`, `data_entrega`, `status`) VALUES
(1, 1, 'Revisão Geral Completa: Sangria dos freios hidráulicos Shimano, lubrificação de cubos e substituição de corrente 12v.', 280.00, DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), 'EM_MANUTENCAO'),
(2, 3, 'Alinhamento de rodas dianteira e traseira, ajuste de câmbio traseiro Shimano Deore e lavagem detalhada com cera.', 140.00, DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY), 'EM_ANALISE'),
(3, 4, 'Troca do movimento central Hollowtech II e revisão de suspensão RockShox Judy Silver.', 350.00, DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY), 'PENDENTE'),
(4, 5, 'Troca de pastilhas de freio a disco e instalação de velocímetro digital sem fio.', 95.00, CURRENT_DATE, 'PRONTO_PARA_RETIRADA'),
(1, 2, 'Substituição de fita de guidão de estrada, troca de cabos de aço e regulagem de sapatas.', 160.00, DATE_SUB(CURRENT_DATE, INTERVAL 2 DAY), 'ENTREGUE');

-- Inserção de Catálogo: Bicicletas Semi-Novas para VENDA
INSERT INTO `bicicleta_catalogo` (`marca`, `modelo`, `cor`, `ano`, `faixa_etaria`, `tipo_operacao`, `valor`, `disponivel`, `imagem_url`, `descricao`) VALUES
-- Infantil (Venda)
('Caloi', 'Hot Wheels Aro 16', 'Azul com Amarelo', 2022, 'INFANTIL', 'VENDA', 380.00, TRUE, 'https://images.unsplash.com/photo-1502744688674-c619d3f86c9e?auto=format&fit=crop&w=600&q=80', 'Bicicleta infantil com rodinhas laterais removíveis, freio V-Brake e buzina. Estado de nova.'),
('Nathor', 'Antonella Aro 14', 'Rosa e Branco', 2023, 'INFANTIL', 'VENDA', 320.00, TRUE, 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80', 'Quadro em alumínio leve, protetor de corrente integral e cestinha frontal inclusa.'),

-- Juvenil (Venda)
('Caloi', 'Two Niner Aro 24', 'Preto com Verde', 2022, 'JUVENIL', 'VENDA', 690.00, TRUE, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', 'Transmissão 21 marchas Shimano Tourney, suspensão dianteira 50mm e freios a disco mecânicos.'),
('GTSM1', 'Walk Aro 24 Juvenil', 'Cinza Chumbo', 2021, 'JUVENIL', 'VENDA', 580.00, TRUE, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=600&q=80', 'Ideal para passeios e trilhas leves, pneus novos e trocadores tipo GripShift revisados.'),

-- Adulto (Venda)
('Specialized', 'Rockhopper Sport 29', 'Vermelho Escuro', 2022, 'ADULTO', 'VENDA', 2850.00, TRUE, 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80', 'Quadro Premium A1 alumínio, transmissão MicroSHIFT 2x9 velocidades e freios hidráulicos Tektro.'),
('Scott', 'Aspect 950 Aro 29', 'Azul Petróleo', 2023, 'ADULTO', 'VENDA', 3400.00, TRUE, 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80', 'Suspensão Suntour XCT30 com trava no guidão, grupo Shimano Altus 18v e pneus Kenda Booster.'),
('Cannondale', 'Trail 7 Aro 29', 'Verde Oliva', 2021, 'ADULTO', 'VENDA', 2200.00, TRUE, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80', 'Excelente para iniciantes no mountain bike com geometria SmartForm C3 e selim Ergo.');

-- Inserção de Catálogo: Bicicletas para ALUGUEL (Valor representa a DIÁRIA em R$)
INSERT INTO `bicicleta_catalogo` (`marca`, `modelo`, `cor`, `ano`, `faixa_etaria`, `tipo_operacao`, `valor`, `disponivel`, `imagem_url`, `descricao`) VALUES
-- Infantil (Aluguel)
('Track Bikes', 'Kids Fun Aro 16', 'Amarelo Sol', 2023, 'INFANTIL', 'ALUGUEL', 25.00, TRUE, 'https://images.unsplash.com/photo-1502744688674-c619d3f86c9e?auto=format&fit=crop&w=600&q=80', 'Diária para passeios em parques e ciclovias com rodinhas auxiliares e capacete incluso.'),
('Caloi', 'Ceci Aro 20 Infantil', 'Branco e Lilás', 2022, 'INFANTIL', 'ALUGUEL', 30.00, FALSE, 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80', 'Confortável e leve, com cestinha frontal para itens pessoais. (Atualmente em locação).'),

-- Juvenil (Aluguel)
('Sense', 'Fun Evo Aro 24', 'Azul Cobalto', 2023, 'JUVENIL', 'ALUGUEL', 40.00, TRUE, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80', 'Bicicleta ágil com 8 velocidades Shimano e freios a disco para jovens ciclistas.'),
('Caloi', 'Snap Aro 24', 'Preto e Laranja', 2022, 'JUVENIL', 'ALUGUEL', 35.00, TRUE, 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=600&q=80', 'Perfeita para circuitos urbanos e finais de semana em família.'),

-- Adulto (Aluguel)
('Trek', 'FX 2 Disc City Aro 28', 'Preto Fosco', 2023, 'ADULTO', 'ALUGUEL', 60.00, TRUE, 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80', 'Bicicleta híbrida urbana rápida, perfeita para turismo na cidade, ciclovias e passeios longos.'),
('Oggi', 'Big Wheel 7.0 Aro 29', 'Grafite e Laranja', 2023, 'ADULTO', 'ALUGUEL', 65.00, FALSE, 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80', 'Mountain bike robusta com trava de suspensão e freio hidráulico. (Atualmente em locação).'),
('Specialized', 'Sirrus X 2.0', 'Verde Floresta', 2023, 'ADULTO', 'ALUGUEL', 75.00, TRUE, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=600&q=80', 'Máximo conforto com manoplas ergonômicas, pneus largos anti-furo e cadeado incluso.');
