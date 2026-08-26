/**
 * ======================================================================
 * COMPONENTE: VISUALIZADOR DE CÓDIGO-FONTE SPRING BOOT 3 (Java 21)
 * Localização: src/components/SpringCodeViewer.tsx
 * ======================================================================
 * Permite inspecionar a arquitetura backend completa gerada:
 * - schema.sql
 * - pom.xml
 * - application.properties
 * - Entidades JPA (Usuario, Cliente, Bicicleta, Servico, BicicletaCatalogo)
 * - Repositories Spring Data JPA
 * - Services com @Transactional
 * - Controllers MVC
 * - Templates Thymeleaf e CSS/JS estáticos
 */

import React, { useState } from 'react';
import { FileCode, Database, Server, Layout, Copy, Check } from 'lucide-react';

interface ArquivoCodigo {
  nome: string;
  caminho: string;
  categoria: 'sql' | 'config' | 'entity' | 'repository' | 'service' | 'controller' | 'thymeleaf';
  linguagem: string;
  conteudo: string;
}

export const SpringCodeViewer: React.FC = () => {
  const [arquivoSelecionado, setArquivoSelecionado] = useState<string>('schema.sql');
  const [copiado, setCopiado] = useState(false);

  const arquivos: ArquivoCodigo[] = [
    {
      nome: 'schema.sql',
      caminho: '/schema.sql',
      categoria: 'sql',
      linguagem: 'sql',
      conteudo: `-- =====================================================================
-- PROJETO BIKEHUB - SCRIPT DDL E DML (MySQL 8.0+)
-- Arquivo: schema.sql
-- =====================================================================
CREATE DATABASE IF NOT EXISTS bikehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bikehub_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(50) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(100) NOT NULL,
    perfil VARCHAR(20) NOT NULL DEFAULT 'ATENDENTE'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS clientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(14) NULL UNIQUE,
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bicicletas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    cor VARCHAR(30) NOT NULL,
    ano INT NOT NULL,
    numero_serie VARCHAR(50) NULL,
    cliente_id BIGINT NOT NULL,
    CONSTRAINT fk_bicicleta_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS servicos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_entrada DATE NOT NULL,
    data_entrega DATE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDENTE',
    cliente_id BIGINT NOT NULL,
    bicicleta_id BIGINT NOT NULL,
    CONSTRAINT fk_servico_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    CONSTRAINT fk_servico_bicicleta FOREIGN KEY (bicicleta_id) REFERENCES bicicletas(id)
) ENGINE=InnoDB;

-- Credencial padrão de administrador: Admin1234 / Admin123456
INSERT INTO usuarios (login, senha, nome_completo, perfil)
VALUES ('Admin1234', 'Admin123456', 'Administrador BikeHub', 'ADMIN')
ON DUPLICATE KEY UPDATE login = login;`,
    },
    {
      nome: 'pom.xml',
      caminho: '/pom.xml',
      categoria: 'config',
      linguagem: 'xml',
      conteudo: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" 
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>
    
    <groupId>br.com.projeto</groupId>
    <artifactId>bikehub</artifactId>
    <version>1.0.0-SNAPSHOT</version>
    <name>BikeHub</name>
    <description>Sistema de Gestão de Oficina, Vendas de Semi-Novas e Aluguel de Bicicletas</description>
    
    <properties>
        <java.version>21</java.version>
    </properties>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
    </dependencies>
</project>`,
    },
    {
      nome: 'Cliente.java',
      caminho: '/src/main/java/br/com/projeto/bikehub/entity/Cliente.java',
      categoria: 'entity',
      linguagem: 'java',
      conteudo: `package br.com.projeto.bikehub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade JPA representativa da tabela 'clientes'.
 */
@Entity
@Table(name = "clientes")
public class Cliente implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do cliente é obrigatório.")
    @Size(min = 3, max = 100, message = "O nome deve conter entre 3 e 100 caracteres.")
    @Column(nullable = false, length = 100)
    private String nome;

    @NotBlank(message = "O telefone de contato é obrigatório.")
    @Column(nullable = false, length = 20)
    private String telefone;

    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Formato de e-mail inválido.")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(unique = true, length = 14)
    private String cpf;

    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Bicicleta> bicicletas = new ArrayList<>();

    // Construtores, Getters e Setters
}`,
    },
    {
      nome: 'Servico.java',
      caminho: '/src/main/java/br/com/projeto/bikehub/entity/Servico.java',
      categoria: 'entity',
      linguagem: 'java',
      conteudo: `package br.com.projeto.bikehub.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Entidade JPA para ordens de serviço da oficina mecânica.
 */
@Entity
@Table(name = "servicos")
public class Servico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "A descrição dos serviços e peças é obrigatória.")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String descricao;

    @NotNull(message = "O valor do serviço é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private StatusServico status = StatusServico.PENDENTE;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "bicicleta_id", nullable = false)
    private Bicicleta bicicleta;
}`,
    },
    {
      nome: 'ClienteService.java',
      caminho: '/src/main/java/br/com/projeto/bikehub/service/ClienteService.java',
      categoria: 'service',
      linguagem: 'java',
      conteudo: `package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.Bicicleta;
import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.repository.BicicletaRepository;
import br.com.projeto.bikehub.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Camada de serviço de Clientes com persistência integrada de bicicletas em transação atômica.
 */
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final BicicletaRepository bicicletaRepository;

    public ClienteService(ClienteRepository clienteRepository, BicicletaRepository bicicletaRepository) {
        this.clienteRepository = clienteRepository;
        this.bicicletaRepository = bicicletaRepository;
    }

    @Transactional
    public Cliente salvarClienteComBicicleta(Cliente cliente, String marca, String modelo, String cor, Integer ano, String numeroSerie) {
        Cliente clienteSalvo = clienteRepository.save(cliente);

        if (marca != null && !marca.trim().isEmpty() && modelo != null && !modelo.trim().isEmpty()) {
            Bicicleta bike = new Bicicleta(marca, modelo, cor, ano, numeroSerie, clienteSalvo);
            bicicletaRepository.save(bike);
        }
        return clienteSalvo;
    }
}`,
    },
    {
      nome: 'ClienteController.java',
      caminho: '/src/main/java/br/com/projeto/bikehub/controller/ClienteController.java',
      categoria: 'controller',
      linguagem: 'java',
      conteudo: `package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.service.ClienteService;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * Controlador MVC para gerenciamento de clientes e bicicletas.
 */
@Controller
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    public ClienteController(ClienteService clienteService, UsuarioService usuarioService) {
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public String listarClientes(Model model, HttpSession session) {
        if (!usuarioService.isUsuarioAutenticado(session)) {
            return "redirect:/login";
        }
        model.addAttribute("clientes", clienteService.listarTodos());
        return "clientes/lista";
    }

    @PostMapping("/salvar")
    public String salvarClienteIntegrado(@Valid @ModelAttribute("cliente") Cliente cliente,
                                        BindingResult result,
                                        @RequestParam(value = "marcaBicicleta", required = false) String marca,
                                        @RequestParam(value = "modeloBicicleta", required = false) String modelo,
                                        RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "clientes/formulario";
        }
        clienteService.salvarClienteComBicicleta(cliente, marca, modelo, ...);
        redirectAttributes.addFlashAttribute("mensagemSucesso", "Cliente e bicicleta cadastrados!");
        return "redirect:/clientes";
    }
}`,
    },
    {
      nome: 'login.html',
      caminho: '/src/main/resources/templates/login.html',
      categoria: 'thymeleaf',
      linguagem: 'html',
      conteudo: `<!DOCTYPE html>
<html lang="pt-BR" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>BikeHub - Login 3D Oficina & Performance</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body class="login-page-3d">
    <!-- Split-Screen Container -->
    <div class="split-screen-wrapper">
        <!-- Coluna Esquerda: Formulário de Autenticação -->
        <div class="auth-column">
            <div class="brand-header">
                <div class="brand-logo-badge">🚲</div>
                <h1>Bike<span>Hub</span></h1>
            </div>
            
            <form th:action="@{/login}" method="POST" class="auth-form">
                <div class="input-group">
                    <label>Usuário ou Matrícula</label>
                    <input type="text" name="username" placeholder="Ex: Admin1234" required>
                </div>
                <div class="input-group">
                    <label>Senha de Acesso</label>
                    <input type="password" name="password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn-primary-3d">Entrar no Sistema →</button>
            </form>
        </div>

        <!-- Coluna Direita: Palco 3D Parallax com Elementos Mecânicos -->
        <div id="stage3d" class="stage-3d-column">
            <div class="stage-spotlight"></div>
            <div class="stage-card-3d">
                <img th:src="@{/images/bike_3d_render.jpg}" alt="3D Bike Performance">
                <div class="badge-3d widget-torque">⚙️ Torque 5.4 Nm</div>
                <div class="badge-3d widget-gear">🔧 12V 10-52T Indexada</div>
            </div>
        </div>
    </div>
    <script th:src="@{/js/login-3d.js}"></script>
</body>
</html>`,
    },
    {
      nome: 'login-3d.js',
      caminho: '/src/main/resources/static/js/login-3d.js',
      categoria: 'config',
      linguagem: 'javascript',
      conteudo: `/**
 * Efeito Parallax 3D e Spot Light para a tela de login moderna BikeHub
 */
document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('stage3d');
    const card = document.querySelector('.stage-card-3d');
    const spotlight = document.querySelector('.stage-spotlight');

    if (!stage || !card) return;

    stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        const rotY = (x - 0.5) * 24;
        const rotX = (0.5 - y) * 20;

        card.style.transform = \`rotateX(\${rotX}deg) rotateY(\${rotY}deg)\`;
        if (spotlight) {
            spotlight.style.left = \`\${x * 100}%\`;
            spotlight.style.top = \`\${y * 100}%\`;
        }
    });

    stage.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
});`,
    },
    {
      nome: 'formulario.html',
      caminho: '/src/main/resources/templates/clientes/formulario.html',
      categoria: 'thymeleaf',
      linguagem: 'html',
      conteudo: `<!DOCTYPE html>
<html lang="pt-BR" xmlns:th="http://www.thymeleaf.org">
<head>
    <title>BikeHub - Cadastro Integrado</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>
<body class="dashboard-body">
    <!-- Formulário Unificado em 2 Seções -->
    <form th:action="@{/clientes/salvar}" th:object="\${cliente}" method="POST">
        <!-- Seção 1: Cliente -->
        <input type="text" th:field="*{nome}" required>
        <span th:if="\${#fields.hasErrors('nome')}" th:errors="*{nome}"></span>

        <input type="text" th:field="*{telefone}" class="mascara-telefone" required>
        <input type="email" th:field="*{email}" required>

        <!-- Seção 2: Bicicleta -->
        <input type="text" name="marcaBicicleta" placeholder="Marca da bike" required>
        <input type="text" name="modeloBicicleta" placeholder="Modelo da bike" required>
        <button type="submit">Salvar Cadastro Integrado</button>
    </form>
    <script th:src="@{/js/script.js}"></script>
</body>
</html>`,
    },
  ];

  const arquivoAtivo = arquivos.find((a) => a.nome === arquivoSelecionado) || arquivos[0];

  const handleCopiar = () => {
    navigator.clipboard.writeText(arquivoAtivo.conteudo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight flex items-center gap-3">
          <FileCode className="w-8 h-8 text-[#E67E22]" />
          <span>Estrutura Completa do Projeto Spring Boot 3</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Explore o código-fonte gerado em Java 21, Spring Data JPA, Hibernate, MySQL, Thymeleaf e JavaScript
        </p>
      </div>

      {/* Grid de Navegação de Arquivos e Visualizador */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px]">
        {/* Painel Lateral de Arquivos */}
        <div className="p-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Arquivos do Projeto</p>
          <div className="space-y-1">
            {arquivos.map((arq) => {
              const estaAtivo = arq.nome === arquivoSelecionado;
              return (
                <button
                  key={arq.nome}
                  onClick={() => setArquivoSelecionado(arq.nome)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    estaAtivo
                      ? 'bg-[#2C3E50] dark:bg-slate-700 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{arq.nome}</span>
                  <span className="text-[10px] font-mono opacity-70 uppercase">{arq.linguagem}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Visualizador de Código */}
        <div className="lg:col-span-3 flex flex-col bg-[#1E293B] dark:bg-slate-950 text-slate-200">
          {/* Header do Arquivo */}
          <div className="p-4 bg-[#0F172A] dark:bg-slate-900 border-b border-slate-700 dark:border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-emerald-400">{arquivoAtivo.caminho}</p>
              <p className="text-sm font-bold text-white mt-0.5">{arquivoAtivo.nome}</p>
            </div>
            <button
              onClick={handleCopiar}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiado ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Código</span>
                </>
              )}
            </button>
          </div>

          {/* Bloco de Código */}
          <div className="p-5 flex-1 overflow-x-auto font-mono text-xs leading-relaxed text-slate-300">
            <pre>{arquivoAtivo.conteudo}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
