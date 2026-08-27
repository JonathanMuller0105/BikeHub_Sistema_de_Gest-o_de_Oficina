package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.AssertTrue;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/** Dados completos para emissão de um contrato de aluguel. */
public record AluguelRequest(
        @NotBlank String codigoContrato,
        @NotNull Long bicicletaId,
        String bicicletaDescricao,
        @NotBlank String clienteNome,
        @NotBlank String clienteCpf,
        @NotBlank String clienteTelefone,
        String clienteEmail,
        String clienteEndereco,
        @NotNull LocalDate dataRetirada,
        @NotNull LocalTime horaRetirada,
        @NotNull LocalDate dataDevolucaoPrevista,
        @NotNull LocalTime horaDevolucaoPrevista,
        @NotNull @Positive Integer quantidadeDiarias,
        @NotNull @Positive BigDecimal valorDiaria,
        @NotNull @Positive BigDecimal valorTotal,
        @NotNull @PositiveOrZero BigDecimal valorCaucao,
        @NotBlank String formaPagamento,
        List<String> acessorios,
        String status,
        @NotNull LocalDate dataCriacao
) {
    @AssertTrue(message = "A devolução prevista não pode ser anterior à retirada.")
    public boolean isPeriodoValido() {
        return dataRetirada == null || dataDevolucaoPrevista == null
                || !dataDevolucaoPrevista.isBefore(dataRetirada);
    }
}
