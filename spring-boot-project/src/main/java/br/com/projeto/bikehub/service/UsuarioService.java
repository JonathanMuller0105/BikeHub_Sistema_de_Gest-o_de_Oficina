package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
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
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
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
                    passwordEncoder.encode("Admin123456"),
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
            // Compara a senha informada com o hash BCrypt cadastrado no banco de dados.
            if (passwordEncoder.matches(senha.trim(), usuario.getSenha())) {
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

    /** Lista todos os funcionários cadastrados sem alterar o fluxo de autenticação. */
    @Transactional(readOnly = true)
    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    /** Busca um usuário para edição, exclusão ou alteração de status. */
    @Transactional(readOnly = true)
    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    /** Cria ou atualiza um funcionário. */
    @Transactional
    public Usuario salvar(Usuario usuario) {
        String senhaInformada = usuario.getSenha();

        if (usuario.getId() != null && (senhaInformada == null || senhaInformada.isBlank())) {
            String hashExistente = usuarioRepository.findById(usuario.getId())
                    .map(Usuario::getSenha)
                    .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + usuario.getId()));
            usuario.setSenha(hashExistente);
        } else if (senhaInformada == null || senhaInformada.isBlank()) {
            throw new IllegalArgumentException("A senha é obrigatória para um novo usuário.");
        } else if (!isBCrypt(senhaInformada)) {
            usuario.setSenha(passwordEncoder.encode(senhaInformada));
        }

        return usuarioRepository.save(usuario);
    }

    private boolean isBCrypt(String senha) {
        return senha.matches("^\\$2[aby]\\$.*");
    }

    /** Exclui um funcionário pelo identificador. */
    @Transactional
    public void excluir(Long id) {
        usuarioRepository.deleteById(id);
    }

    /** Alterna a conta entre ativa e inativa e devolve o registro atualizado. */
    @Transactional
    public Usuario alternarStatusAtivo(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + id));
        usuario.setAtivo(!Boolean.TRUE.equals(usuario.getAtivo()));
        return usuarioRepository.save(usuario);
    }
}
