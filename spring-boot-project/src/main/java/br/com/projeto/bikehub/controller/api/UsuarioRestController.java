package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.UsuarioRequest;
import br.com.projeto.bikehub.controller.api.dto.UsuarioResponse;
import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** API REST de funcionários, sem exposição da senha armazenada. */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioRestController {

    private final UsuarioService usuarioService;

    public UsuarioRestController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public List<UsuarioResponse> listar() {
        return usuarioService.listarTodos().stream().map(UsuarioResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<?> salvar(@Valid @RequestBody UsuarioRequest request) {
        try {
            boolean edicao = request.id() != null;
            Usuario usuario = edicao
                    ? usuarioService.buscarPorId(request.id())
                        .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."))
                    : new Usuario();

            if (!edicao && (request.senha() == null || request.senha().isBlank())) {
                return ResponseEntity.badRequest().body(Map.of("mensagem", "A senha é obrigatória para um novo usuário."));
            }

            usuario.setUsername(request.login().trim());
            if (request.senha() != null && !request.senha().isBlank()) {
                usuario.setSenha(request.senha());
            }
            usuario.setNomeCompleto(request.nomeCompleto().trim());
            usuario.setEmail(request.email());
            usuario.setTelefone(request.telefone());
            usuario.setCargo(request.cargo());
            usuario.setPerfil(request.perfil());
            usuario.setAtivo(request.ativo() == null ? true : request.ativo());

            Usuario salvo = usuarioService.salvar(usuario);
            ResponseEntity.BodyBuilder resposta = edicao
                    ? ResponseEntity.ok()
                    : ResponseEntity.created(URI.create("/api/usuarios/" + salvo.getId()));
            return resposta.body(UsuarioResponse.from(salvo));
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(409).body(Map.of("mensagem", "O login informado já está em uso."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (usuarioService.buscarPorId(id).isEmpty()) return ResponseEntity.notFound().build();
        usuarioService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public UsuarioResponse alternarStatus(@PathVariable Long id) {
        return UsuarioResponse.from(usuarioService.alternarStatusAtivo(id));
    }
}
