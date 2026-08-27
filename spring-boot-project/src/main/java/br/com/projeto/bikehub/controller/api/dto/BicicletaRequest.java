package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BicicletaRequest(
        @NotBlank String marca,
        @NotBlank String modelo,
        @NotBlank String cor,
        @NotNull @Min(1970) Integer ano,
        String numeroSerie
) {
}
