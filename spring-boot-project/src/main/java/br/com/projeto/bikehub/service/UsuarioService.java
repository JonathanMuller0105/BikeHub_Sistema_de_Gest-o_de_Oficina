package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

/**
 * ======================================================================
 * SERVIÇO: AUTENTICAÇÃO E USUÁRIOS (br.com.projeto.bikehub.service.UsuarioService)
 * ======================================================================
 * Responsável pela regra de autenticação de operadores e controle
 * de sessão HTTP no sistema BikeHub.
 */
@Service
public class UsuarioService {

    /**
     * Chave utilizada para armazenar o objeto do usuário autenticado na sessão HTTP.
     */
    public static final String SESSION_USUARIO_LOGADO = "usuarioLogado";

    private final UsuarioRepository usuarioRepository;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    /**
     * Método executado na inicialização da aplicação para garantir que o
     * usuário Administrador padrão esteja cadastrado no banco de dados.
     * Credenciais padrão:
     * - Usuário: Admin1234
     * - Senha:   Admin123456
     */
    @PostConstruct
    @Transactional
    public void inicializarUsuarioAdminPadrao() {
        if (!usuarioRepository.existsByUsername("Admin1234")) {
            Usuario admin = new Usuario(
                    "Admin1234",
                    "Admin123456",
                    "Administrador BikeHub"
            );
            usuarioRepository.save(admin);
            System.out.println("[BikeHub] Usuário Administrador padrão inicializado: Admin1234 / Admin123456");
        }
    }

    /**
     * Valida as credenciais fornecidas no formulário de login e registra o usuário na sessão HTTP.
     *
     * @param username Nome de login digitado
     * @param senha Senha digitada
     * @param session Sessão HTTP corrente do usuário
     * @return true se a autenticação for bem-sucedida, false se as credenciais forem inválidas
     */
    @Transactional(readOnly = true)
    public boolean autenticar(String username, String senha, HttpSession session) {
        // Validação de campos vazios ou nulos
        if (username == null || username.trim().isEmpty() || senha == null || senha.trim().isEmpty()) {
            return false;
        }

        // Busca o usuário ativo no repositório
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsernameAndAtivoTrue(username.trim());

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Compara a senha informada com a cadastrada no banco de dados
            if (usuario.getSenha().equals(senha.trim())) {
                // Armazena o usuário autenticado na sessão HTTP
                session.setAttribute(SESSION_USUARIO_LOGADO, usuario);
                return true;
            }
        }

        // Credenciais incorretas ou usuário inativo
        return false;
    }

    /**
     * Realiza o encerramento da sessão HTTP (Logout do operador).
     *
     * @param session Sessão HTTP ativa a ser invalidada
     */
    public void deslogar(HttpSession session) {
        if (session != null) {
            session.removeAttribute(SESSION_USUARIO_LOGADO);
            session.invalidate();
        }
    }

    /**
     * Verifica se existe um usuário autenticado na sessão atual.
     *
     * @param session Sessão HTTP a verificar
     * @return true se houver usuário logado
     */
    public boolean isUsuarioLogado(HttpSession session) {
        return session != null && session.getAttribute(SESSION_USUARIO_LOGADO) != null;
    }

    /**
     * Retorna o usuário logado na sessão ou null se não houver.
     *
     * @param session Sessão HTTP
     * @return Usuário autenticado
     */
    public Usuario getUsuarioLogado(HttpSession session) {
        if (session == null) {
            return null;
        }
        return (Usuario) session.getAttribute(SESSION_USUARIO_LOGADO);
    }
}
