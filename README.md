<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/516f8205-81a0-451a-abfa-0e1d644f1d88

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

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
