package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.Bicicleta;
import br.com.projeto.bikehub.entity.Cliente;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO de resposta utilizado para apresentar clientes ao React sem expor
 * diretamente as entidades JPA nem criar um ciclo JSON entre cliente e bicicleta.
 */
public record ClienteResponse(
        Long id,
        String nome,
        String telefone,
        String email,
        String cpf,
        String endereco,
        List<BicicletaResponse> bicicletas,
        LocalDateTime dataCadastro
) {
    /** Converte um cliente e suas bicicletas para o formato esperado pelo front-end. */
    public static ClienteResponse from(Cliente cliente, List<Bicicleta> bicicletas) {
        return new ClienteResponse(
                cliente.getId(),
                cliente.getNome(),
                cliente.getTelefone(),
                cliente.getEmail(),
                cliente.getCpf(),
                null,
                bicicletas.stream().map(BicicletaResponse::from).toList(),
                cliente.getCriadoEm()
        );
    }

    public record BicicletaResponse(
            Long id,
            String marca,
            String modelo,
            String cor,
            Integer ano,
            String numeroSerie,
            Long clienteId
    ) {
        /** Converte a entidade Bicicleta para uma resposta JSON sem referência circular. */
        public static BicicletaResponse from(Bicicleta bicicleta) {
            return new BicicletaResponse(
                    bicicleta.getId(),
                    bicicleta.getMarca(),
                    bicicleta.getModelo(),
                    bicicleta.getCor(),
                    bicicleta.getAno(),
                    bicicleta.getNumeroSerie(),
                    bicicleta.getCliente().getId()
            );
        }
    }
}
