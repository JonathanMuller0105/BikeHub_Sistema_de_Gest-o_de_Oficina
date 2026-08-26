package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
        @NotNull BigDecimal valorOriginal,
        @NotNull BigDecimal desconto,
        @NotNull BigDecimal valorFinal,
        @NotBlank String formaPagamento,
        Integer parcelas,
        @NotNull LocalDate dataVenda,
        @NotNull Integer garantiaMeses
) {
}
