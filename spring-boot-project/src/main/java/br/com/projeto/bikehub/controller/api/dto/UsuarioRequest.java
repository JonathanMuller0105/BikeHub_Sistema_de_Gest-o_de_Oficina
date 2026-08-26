package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.NotBlank;

/** Dados de criação ou edição de funcionário; a senha entra apenas neste DTO. */
public record UsuarioRequest(
        Long id,
        @NotBlank String login,
        String senha,
        @NotBlank String nomeCompleto,
        String email,
        String telefone,
        String cargo,
        @NotBlank String perfil,
        Boolean ativo
) {
}
