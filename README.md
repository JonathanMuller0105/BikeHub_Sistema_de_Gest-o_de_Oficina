# BikeHub — Sistema de Gestão de Oficina, Vendas e Aluguel de Bicicletas

O BikeHub centraliza a gestão de clientes e suas bicicletas, ordens de serviço,
catálogo de venda e aluguel, vendas, contratos de aluguel e usuários da oficina.
O front-end React consome uma API REST Spring Boot com persistência em MySQL.

## Stack utilizada

- **Front-end:** React, TypeScript, Vite e Tailwind CSS.
- **Back-end:** Java 21 e Spring Boot.
- **Banco de dados:** MySQL 8.

## Como rodar localmente

### Pré-requisitos

- Node.js e npm.
- Java 21.
- Maven 3.9 ou uma IDE com suporte a Maven.
- MySQL 8 em execução.

### 1. Preparar o banco de dados

Inicie o MySQL. Para criar as tabelas e os dados de demonstração de forma
explícita, abra o arquivo `schema.sql` no MySQL Workbench e execute o script
completo.

Como alternativa para desenvolvimento, basta garantir que o usuário configurado
tenha permissão para criar o banco: a URL JDBC contém
`createDatabaseIfNotExist=true` e o Hibernate está configurado com
`spring.jpa.hibernate.ddl-auto=update`.

### 2. Configurar e iniciar o back-end

As propriedades estão em
`spring-boot-project/src/main/resources/application.properties`. Por padrão, a
aplicação usa o banco `bikehub` em `localhost:3306` com credenciais `root` /
`root`. Para outras credenciais, defina `DB_USERNAME` e `DB_PASSWORD` conforme
a seção [Configuração do MySQL](#configuração-do-mysql).

Na raiz do projeto, execute:

```bash
mvn spring-boot:run
```

O back-end e a API REST ficarão disponíveis em `http://localhost:8080`.

### 3. Instalar e iniciar o front-end

Em outro terminal, também na raiz do projeto, execute:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. O front-end está configurado para consumir a API
Spring Boot em `http://localhost:8080`.

## Configuração do MySQL

O backend usa o banco `bikehub` em `localhost:3306`. Sem configuração adicional,
as credenciais locais continuam sendo `root` / `root`. Para usar credenciais
diferentes, defina as variáveis de ambiente antes de iniciar o Spring Boot.

No Windows PowerShell, para a sessão atual:

```powershell
$env:DB_USERNAME = "seu_usuario"
$env:DB_PASSWORD = "sua_senha"
```

No Linux ou macOS:

```bash
export DB_USERNAME="seu_usuario"
export DB_PASSWORD="sua_senha"
```

Não grave credenciais reais nos arquivos versionados. Em produção, configure
essas variáveis no ambiente de execução ou no sistema de CI/CD. Consulte
`spring-boot-project/src/main/resources/application.properties.example` para
ver todas as propriedades disponíveis.

## Validação do banco do zero

O procedimento destrutivo e manual para recriar o banco pelo `schema.sql` e
validá-lo com o Hibernate está em
[`docs/validacao-schema.md`](docs/validacao-schema.md). O projeto mantém
`spring.jpa.hibernate.ddl-auto=update` como configuração padrão.
