package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.Bicicleta;

public record BicicletaResponse(
        Long id,
        String marca,
        String modelo,
        String cor,
        Integer ano,
        String numeroSerie,
        Long clienteId
) {
    public static BicicletaResponse from(Bicicleta bicicleta) {
        return new BicicletaResponse(
                bicicleta.getId(), bicicleta.getMarca(), bicicleta.getModelo(), bicicleta.getCor(),
                bicicleta.getAno(), bicicleta.getNumeroSerie(), bicicleta.getCliente().getId());
    }
}
