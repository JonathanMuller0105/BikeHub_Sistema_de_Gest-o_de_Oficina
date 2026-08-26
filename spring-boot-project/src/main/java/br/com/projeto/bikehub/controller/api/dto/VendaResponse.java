package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.Venda;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Histórico de venda no formato consumido pela tela React. */
public record VendaResponse(
        Long id,
        Long bicicletaId,
        String bicicletaDescricao,
        String clienteNome,
        String clienteCpf,
        String clienteTelefone,
        String clienteEmail,
        BigDecimal valorOriginal,
        BigDecimal desconto,
        BigDecimal valorFinal,
        String formaPagamento,
        Integer parcelas,
        LocalDate dataVenda,
        Integer garantiaMeses
) {
    public static VendaResponse from(Venda venda) {
        BicicletaCatalogo bike = venda.getBicicleta();
        return new VendaResponse(
                venda.getId(), bike.getId(),
                bike.getMarca() + " " + bike.getModelo() + " (" + bike.getCor() + ", " + bike.getAno() + ")",
                venda.getClienteNome(), venda.getClienteCpf(), venda.getClienteTelefone(), venda.getClienteEmail(),
                venda.getValorOriginal(), venda.getDesconto(), venda.getValorFinal(), venda.getFormaPagamento(),
                venda.getParcelas(), venda.getDataVenda(), venda.getGarantiaMeses()
        );
    }
}
