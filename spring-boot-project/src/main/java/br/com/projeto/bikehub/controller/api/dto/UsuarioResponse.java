package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.Usuario;
import java.time.LocalDate;

/** Resposta pública de usuário. A senha nunca é incluída no JSON. */
public record UsuarioResponse(
        Long id,
        String login,
        String nomeCompleto,
        String email,
        String telefone,
        String cargo,
        String perfil,
        Boolean ativo,
        LocalDate dataCadastro
) {
    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(), usuario.getUsername(), usuario.getNomeCompleto(), usuario.getEmail(),
                usuario.getTelefone(), usuario.getCargo(), usuario.getPerfil(), usuario.getAtivo(),
                usuario.getCriadoEm() == null ? null : usuario.getCriadoEm().toLocalDate()
        );
    }
}
