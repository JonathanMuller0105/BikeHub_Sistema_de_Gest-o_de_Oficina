package br.com.projeto.bikehub.controller.api.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/** Resultado da vistoria e quitação da caução na devolução. */
public record DevolucaoRequest(
        @NotNull LocalDate dataDevolucaoEfetiva,
        @NotNull LocalTime horaDevolucaoEfetiva,
        @NotNull BigDecimal valorCaucaoDevolvido,
        @NotNull BigDecimal taxaAvariaOuAtraso,
        String motivoTaxa,
        String metodoDevolucaoCaucao,
        String observacaoDevolucao
) {
}
