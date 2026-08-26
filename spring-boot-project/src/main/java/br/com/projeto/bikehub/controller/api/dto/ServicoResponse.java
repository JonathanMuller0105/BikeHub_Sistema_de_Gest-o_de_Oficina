package br.com.projeto.bikehub.controller.api.dto;

import br.com.projeto.bikehub.entity.Servico;
import br.com.projeto.bikehub.entity.Servico.StatusServico;
import java.math.BigDecimal;
import java.time.LocalDate;

/** Resposta de OS compatível com a interface Servico do front-end. */
public record ServicoResponse(
        Long id,
        Long clienteId,
        String clienteNome,
        String clienteTelefone,
        Long bicicletaId,
        String bicicletaDescricao,
        String descricao,
        BigDecimal valor,
        LocalDate dataEntrada,
        LocalDate dataEntrega,
        String status
) {
    public static ServicoResponse from(Servico servico) {
        return new ServicoResponse(
                servico.getId(),
                servico.getCliente().getId(),
                servico.getCliente().getNome(),
                servico.getCliente().getTelefone(),
                servico.getBicicleta().getId(),
                servico.getBicicleta().getDescricaoCompleta(),
                servico.getDescricao(),
                servico.getValor(),
                servico.getDataAbertura().toLocalDate(),
                servico.getDataEntrega(),
                paraStatusReact(servico.getStatus())
        );
    }

    public static String paraStatusReact(StatusServico status) {
        return switch (status) {
            case PENDENTE -> "PENDENTE";
            case EM_ANALISE -> "ANALISE";
            case EM_MANUTENCAO -> "MANUTENCAO";
            case PRONTO_PARA_RETIRADA -> "PRONTO";
            case ENTREGUE -> "ENTREGUE";
        };
    }

    public static StatusServico paraStatusJpa(String status) {
        return switch (status.toUpperCase()) {
            case "PENDENTE" -> StatusServico.PENDENTE;
            case "ANALISE", "EM_ANALISE" -> StatusServico.EM_ANALISE;
            case "MANUTENCAO", "EM_MANUTENCAO" -> StatusServico.EM_MANUTENCAO;
            case "PRONTO", "PRONTO_PARA_RETIRADA" -> StatusServico.PRONTO_PARA_RETIRADA;
            case "ENTREGUE" -> StatusServico.ENTREGUE;
            default -> throw new IllegalArgumentException("Status de serviço inválido: " + status);
        };
    }
}
