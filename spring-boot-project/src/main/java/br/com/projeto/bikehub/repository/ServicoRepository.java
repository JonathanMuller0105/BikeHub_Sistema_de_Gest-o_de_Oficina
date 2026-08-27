package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.Servico;
import br.com.projeto.bikehub.entity.Servico.StatusServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

/**
 * ======================================================================
 * REPOSITÓRIO: ORDEM DE SERVIÇO (br.com.projeto.bikehub.repository.ServicoRepository)
 * ======================================================================
 * Interface JPA para gerenciamento das ordens de serviço da oficina mecânica.
 */
@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {

    boolean existsByBicicletaId(Long bicicletaId);

    /**
     * Retorna todas as ordens de serviço com um status específico.
     *
     * @param status Status desejado (PENDENTE, EM_ANALISE, etc.)
     * @return Lista de serviços filtrados
     */
    List<Servico> findByStatusOrderByDataEntregaAsc(StatusServico status);

    /**
     * Retorna todas as ordens de serviço de um determinado cliente.
     *
     * @param clienteId ID do cliente
     * @return Lista de OS do cliente
     */
    List<Servico> findByClienteIdOrderByDataAberturaDesc(Long clienteId);

    /**
     * Conta a quantidade de serviços em determinado status (usado nos cartões do Dashboard).
     *
     * @param status Status do serviço
     * @return Quantidade de OS naquele status
     */
    long countByStatus(StatusServico status);

    /**
     * Soma o faturamento total acumulado de todos os serviços finalizados/entregues.
     *
     * @return Valor total faturado pela oficina em Reais (R$)
     */
    @Query("SELECT COALESCE(SUM(s.valor), 0) FROM Servico s WHERE s.status = 'ENTREGUE'")
    BigDecimal somarFaturamentoServicosEntregues();

    /**
     * Retorna todas as ordens de serviço trazendo os dados de Cliente e Bicicleta
     * carregados via JOIN FETCH em consulta única para alta performance.
     *
     * @return Lista completa de OS prontas para exibição na tabela da oficina
     */
    @Query("SELECT s FROM Servico s " +
           "JOIN FETCH s.cliente " +
           "JOIN FETCH s.bicicleta " +
           "ORDER BY s.dataAbertura DESC")
    List<Servico> findAllWithDetails();

    /**
     * Busca os últimos N serviços abertos recentemente para o feed de atividades do Dashboard.
     *
     * @return Lista das 5 ordens de serviço mais recentes
     */
    @Query("SELECT s FROM Servico s " +
           "JOIN FETCH s.cliente " +
           "JOIN FETCH s.bicicleta " +
           "ORDER BY s.dataAbertura DESC LIMIT 5")
    List<Servico> findRecentActivities();
}
