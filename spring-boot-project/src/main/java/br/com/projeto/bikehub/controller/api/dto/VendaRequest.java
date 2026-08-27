package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Dados completos do checkout de uma bicicleta semi-nova. */
public record VendaRequest(
        @NotNull Long bicicletaId,
        String bicicletaDescricao,
        @NotBlank String clienteNome,
        @NotBlank String clienteCpf,
        @NotBlank String clienteTelefone,
        String clienteEmail,
        @NotNull @Positive BigDecimal valorOriginal,
        @NotNull @PositiveOrZero BigDecimal desconto,
        @NotNull @Positive BigDecimal valorFinal,
        @NotBlank String formaPagamento,
        @Positive Integer parcelas,
        @NotNull LocalDate dataVenda,
        @NotNull @PositiveOrZero Integer garantiaMeses
) {
}
