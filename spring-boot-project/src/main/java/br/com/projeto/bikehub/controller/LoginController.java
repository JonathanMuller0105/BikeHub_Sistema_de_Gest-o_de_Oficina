package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

/**
 * ======================================================================
 * CONTROLADOR: AUTENTICAÇÃO E LOGIN (br.com.projeto.bikehub.controller.LoginController)
 * ======================================================================
 * Responsável pelo fluxo de autenticação de usuários no BikeHub:
 * - Exibição da tela de login (/login)
 * - Processamento das credenciais enviadas via POST
 * - Criação da sessão HTTP
 * - Logout seguro do sistema (/logout)
 */
@Controller
public class LoginController {

    private final UsuarioService usuarioService;

    @Autowired
    public LoginController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Rota raiz da aplicação: Redireciona para o Dashboard caso o usuário já esteja autenticado,
     * ou para a tela de login se for um visitante anônimo.
     */
    @GetMapping("/")
    public String index(HttpSession session) {
        if (usuarioService.isUsuarioLogado(session)) {
            return "redirect:/dashboard";
        }
        return "redirect:/login";
    }

    /**
     * Exibe a página de login centralizada.
     * Caso o usuário já tenha sessão válida, redireciona diretamente para o painel.
     *
     * @param session Sessão HTTP corrente
     * @param model Objeto para envio de atributos à view Thymeleaf
     * @return Nome do template 'login' (src/main/resources/templates/login.html)
     */
    @GetMapping("/login")
    public String exibirLogin(HttpSession session, Model model) {
        if (usuarioService.isUsuarioLogado(session)) {
            return "redirect:/dashboard";
        }
        return "login";
    }

    /**
     * Processa a submissão do formulário de login.
     *
     * @param username Nome de usuário preenchido (ex: Admin1234)
     * @param senha Senha digitada (ex: Admin123456)
     * @param session Sessão HTTP para armazenamento do estado autenticado
     * @param redirectAttributes Mensagens flash para exibição após redirect
     * @return Redirecionamento para /dashboard (sucesso) ou de volta para /login (falha)
     */
    @PostMapping("/login")
    public String processarLogin(@RequestParam("username") String username,
                                 @RequestParam("senha") String senha,
                                 HttpSession session,
                                 RedirectAttributes redirectAttributes) {

        // Executa a autenticação via serviço
        boolean autenticado = usuarioService.autenticar(username, senha, session);

        if (autenticado) {
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Bem-vindo ao sistema BikeHub!");
            return "redirect:/dashboard";
        } else {
            // Em caso de erro, define mensagem de alerta e preserva o login digitado
            redirectAttributes.addFlashAttribute("mensagemErro", "Usuário ou senha inválidos. Tente novamente.");
            redirectAttributes.addFlashAttribute("usernameDigitado", username);
            return "redirect:/login";
        }
    }

    /**
     * Realiza o encerramento da sessão do operador e redireciona para o login com mensagem.
     *
     * @param session Sessão HTTP a ser encerrada
     * @param redirectAttributes Mensagem flash de saída
     * @return Redirecionamento para /login
     */
    @GetMapping("/logout")
    public String logout(HttpSession session, RedirectAttributes redirectAttributes) {
        usuarioService.deslogar(session);
        redirectAttributes.addFlashAttribute("mensagemSucesso", "Você encerrou sua sessão com sucesso.");
        return "redirect:/login";
    }
}
