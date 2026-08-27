package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/** Resultado da vistoria e quitação da caução na devolução. */
public record DevolucaoRequest(
        @NotNull LocalDate dataDevolucaoEfetiva,
        @NotNull LocalTime horaDevolucaoEfetiva,
        @NotNull @PositiveOrZero BigDecimal valorCaucaoDevolvido,
        @NotNull @PositiveOrZero BigDecimal taxaAvariaOuAtraso,
        String motivoTaxa,
        String metodoDevolucaoCaucao,
        String observacaoDevolucao
) {
}
