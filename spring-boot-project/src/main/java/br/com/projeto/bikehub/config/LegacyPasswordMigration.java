package br.com.projeto.bikehub.config;

import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.repository.UsuarioRepository;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/** Converte uma única vez as senhas legadas em texto puro para BCrypt. */
@Component
public class LegacyPasswordMigration implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public LegacyPasswordMigration(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        List<Usuario> usuariosMigrados = usuarioRepository.findAll().stream()
                .filter(usuario -> !isBCrypt(usuario.getSenha()))
                .peek(usuario -> usuario.setSenha(passwordEncoder.encode(usuario.getSenha())))
                .toList();

        if (!usuariosMigrados.isEmpty()) {
            usuarioRepository.saveAll(usuariosMigrados);
            System.out.printf("[BikeHub] %d senha(s) legada(s) migrada(s) para BCrypt.%n", usuariosMigrados.size());
        }
    }

    private boolean isBCrypt(String senha) {
        return senha != null && senha.matches("^\\$2[aby]\\$.*");
    }
}
