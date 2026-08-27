# Validação manual do `schema.sql`

Este procedimento comprova que o `schema.sql` consegue recriar o banco sem a
ajuda do `spring.jpa.hibernate.ddl-auto=update`. Ele é destrutivo: faça backup
dos dados locais que quiser preservar e execute-o apenas em desenvolvimento.

## 1. Preparar e recriar o banco

1. Pare a aplicação Spring Boot para impedir alterações concorrentes.
2. No MySQL Workbench, conecte-se à instância local.
3. Se precisar preservar os dados atuais, use **Server > Data Export** e exporte
   o schema `bikehub` antes de continuar.
4. Abra uma nova aba SQL e execute:

   ```sql
   DROP DATABASE IF EXISTS bikehub;
   ```

5. No Workbench, abra o `schema.sql` localizado na raiz do projeto.
6. Execute o script inteiro, sem selecionar apenas um trecho.
7. Confirme em **Schemas** que `bikehub` contém as tabelas `usuario`, `cliente`,
   `bicicleta`, `servico`, `bicicleta_catalogo`, `venda` e `aluguel`.

## 2. Validar com o Hibernate

1. Em `spring-boot-project/src/main/resources/application.properties`, altere
   temporariamente:

   ```properties
   spring.jpa.hibernate.ddl-auto=validate
   spring.sql.init.mode=never
   ```

2. Inicie o backend normalmente.
3. A validação passou se a aplicação exibir `Started BikeHubApplication` e não
   registrar `SchemaManagementException`, `Schema-validation` ou erro de coluna,
   tipo ou tabela ausente.
4. Consulte `GET http://localhost:8080/api/clientes` e confirme HTTP 200.
5. Pare o backend e restaure os valores versionados:

   ```properties
   spring.jpa.hibernate.ddl-auto=update
   spring.sql.init.mode=always
   ```

Não faça commit dos valores temporários de validação.

## Resultado da revisão estática

Os mapeamentos de `Venda.java` e `Aluguel.java` foram comparados coluna a
coluna com `CREATE TABLE venda` e `CREATE TABLE aluguel`. Nomes, nulabilidade,
tamanhos, precisão decimal, escala, chaves estrangeiras e valores do enum de
status estão alinhados. O usuário inicial do script também usa BCrypt, mantendo
o login `Admin1234` / `Admin123456` sem gravar a senha em texto puro.
