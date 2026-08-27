package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada da API de clientes.
 *
 * Reúne os dados pessoais do cliente e os dados opcionais de sua bicicleta
 * para permitir o cadastro integrado em uma única requisição HTTP.
 * O endereço é aceito para manter compatibilidade com o front-end, mas não é
 * persistido porque a entidade e a tabela atuais não possuem esse campo.
 */
public record ClienteRequest(
        @NotBlank(message = "O nome do cliente é obrigatório.")
        @Size(min = 3, max = 120, message = "O nome deve ter entre 3 e 120 caracteres.")
        String nome,

        @NotBlank(message = "O telefone de contato é obrigatório.")
        String telefone,

        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "Informe um endereço de e-mail válido.")
        String email,

        String cpf,
        String endereco,
        Long bicicletaId,
        String marca,
        String modelo,
        String cor,
        Integer ano,
        String numeroSerie
) {
}
