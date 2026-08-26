package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Dados necessários para abrir uma Ordem de Serviço pelo React. */
public record ServicoRequest(
        @NotNull Long clienteId,
        @NotNull Long bicicletaId,
        @NotBlank String descricao,
        @NotNull @DecimalMin("0.01") BigDecimal valor,
        @NotNull LocalDate dataEntrega
) {
}
