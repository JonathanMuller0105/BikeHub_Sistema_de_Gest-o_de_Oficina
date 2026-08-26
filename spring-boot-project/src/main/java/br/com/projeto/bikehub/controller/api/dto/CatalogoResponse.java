package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import java.math.BigDecimal;

/** Resposta do catálogo com os nomes de propriedades esperados pelo React. */
public record CatalogoResponse(
        Long id,
        String marca,
        String modelo,
        Integer ano,
        String cor,
        String descricao,
        BigDecimal valor,
        String faixaEtaria,
        String tipo,
        String imagemUrl,
        Boolean disponivel,
        String numeroSerie
) {
    public static CatalogoResponse from(BicicletaCatalogo item) {
        return new CatalogoResponse(
                item.getId(), item.getMarca(), item.getModelo(), item.getAno(), item.getCor(),
                item.getDescricao(), item.getValor(), item.getFaixaEtaria().name(),
                item.getTipoOperacao().name(), item.getImagemUrl(), item.getDisponivel(), null
        );
    }
}
