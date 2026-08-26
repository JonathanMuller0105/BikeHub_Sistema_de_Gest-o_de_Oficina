package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.Aluguel;
import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/** Contrato de aluguel no formato esperado pelo front-end. */
public record AluguelResponse(
        Long id,
        String codigoContrato,
        Long bicicletaId,
        String bicicletaDescricao,
        String clienteNome,
        String clienteCpf,
        String clienteTelefone,
        String clienteEmail,
        String clienteEndereco,
        LocalDate dataRetirada,
        LocalTime horaRetirada,
        LocalDate dataDevolucaoPrevista,
        LocalTime horaDevolucaoPrevista,
        LocalDate dataDevolucaoEfetiva,
        LocalTime horaDevolucaoEfetiva,
        Integer quantidadeDiarias,
        BigDecimal valorDiaria,
        BigDecimal valorTotal,
        BigDecimal valorCaucao,
        BigDecimal valorCaucaoDevolvido,
        BigDecimal taxaAvariaOuAtraso,
        String motivoTaxa,
        String metodoDevolucaoCaucao,
        String observacaoDevolucao,
        String formaPagamento,
        List<String> acessorios,
        String status,
        LocalDate dataCriacao
) {
    public static AluguelResponse from(Aluguel aluguel) {
        BicicletaCatalogo bike = aluguel.getBicicleta();
        List<String> acessorios = aluguel.getAcessorios() == null || aluguel.getAcessorios().isBlank()
                ? List.of() : List.of(aluguel.getAcessorios().split("\\n"));
        return new AluguelResponse(
                aluguel.getId(), aluguel.getCodigoContrato(), bike.getId(),
                bike.getMarca() + " " + bike.getModelo() + " (" + bike.getCor() + ", " + bike.getAno() + ")",
                aluguel.getClienteNome(), aluguel.getClienteCpf(), aluguel.getClienteTelefone(),
                aluguel.getClienteEmail(), aluguel.getClienteEndereco(), aluguel.getDataRetirada(),
                aluguel.getHoraRetirada(), aluguel.getDataDevolucaoPrevista(), aluguel.getHoraDevolucaoPrevista(),
                aluguel.getDataDevolucaoEfetiva(), aluguel.getHoraDevolucaoEfetiva(), aluguel.getQuantidadeDiarias(),
                aluguel.getValorDiaria(), aluguel.getValorTotal(), aluguel.getValorCaucao(),
                aluguel.getValorCaucaoDevolvido(), aluguel.getTaxaAvariaOuAtraso(), aluguel.getMotivoTaxa(),
                aluguel.getMetodoDevolucaoCaucao(), aluguel.getObservacaoDevolucao(), aluguel.getFormaPagamento(),
                acessorios, aluguel.getStatus().name(), aluguel.getDataCriacao()
        );
    }
}
