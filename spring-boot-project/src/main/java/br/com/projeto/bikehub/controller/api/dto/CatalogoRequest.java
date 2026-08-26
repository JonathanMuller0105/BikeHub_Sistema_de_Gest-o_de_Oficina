package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.BicicletaCatalogo.FaixaEtaria;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.TipoOperacao;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/** Dados para inclusão de uma bicicleta no catálogo comercial. */
public record CatalogoRequest(
        @NotBlank String marca,
        @NotBlank String modelo,
        @NotNull @Min(1990) Integer ano,
        @NotBlank String cor,
        String descricao,
        @NotNull @DecimalMin("0.01") BigDecimal valor,
        @NotNull FaixaEtaria faixaEtaria,
        @NotNull TipoOperacao tipo,
        String imagemUrl,
        Boolean disponivel,
        String numeroSerie
) {
}
