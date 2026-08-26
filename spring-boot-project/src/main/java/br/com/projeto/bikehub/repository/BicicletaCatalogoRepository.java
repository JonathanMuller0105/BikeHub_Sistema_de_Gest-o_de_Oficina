package br.com.projeto.bikehub.repository;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.FaixaEtaria;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.TipoOperacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

/**
 * ======================================================================
 * REPOSITÓRIO: CATÁLOGO DE BICICLETAS (br.com.projeto.bikehub.repository.BicicletaCatalogoRepository)
 * ======================================================================
 * Repositório JPA para consultas avançadas e filtros no estoque de
 * vendas de semi-novas e frota de locação por diária.
 */
@Repository
public interface BicicletaCatalogoRepository extends JpaRepository<BicicletaCatalogo, Long> {

    /**
     * Retorna todas as bicicletas de um tipo de operação comercial (VENDA ou ALUGUEL).
     *
     * @param tipoOperacao Tipo comercial (VENDA ou ALUGUEL)
     * @return Lista de bicicletas no catálogo
     */
    List<BicicletaCatalogo> findByTipoOperacaoOrderByValorAsc(TipoOperacao tipoOperacao);

    /**
     * Retorna bicicletas disponíveis por tipo de operação.
     *
     * @param tipoOperacao Tipo comercial
     * @param disponivel true para filtrar apenas disponíveis
     * @return Lista de itens disponíveis
     */
    List<BicicletaCatalogo> findByTipoOperacaoAndDisponivelOrderByValorAsc(TipoOperacao tipoOperacao, Boolean disponivel);

    /**
     * ==================================================================
     * CONSULTA CUSTOMIZADA COM @Query: FILTRAGEM POR FAIXA ETÁRIA E TIPO
     * ==================================================================
     * Esta consulta JPQL filtra o catálogo combinando o tipo comercial
     * (VENDA ou ALUGUEL) e uma faixa etária específica (INFANTIL, JUVENIL, ADULTO).
     *
     * @param tipoOperacao Tipo de operação comercial (obrigatório)
     * @param faixaEtaria Faixa etária desejada
     * @return Lista de bicicletas filtradas ordenadas por valor
     */
    @Query("SELECT b FROM BicicletaCatalogo b WHERE " +
           "b.tipoOperacao = :tipoOperacao AND " +
           "b.faixaEtaria = :faixaEtaria " +
           "ORDER BY b.valor ASC")
    List<BicicletaCatalogo> findByTipoAndFaixaEtaria(
            @Param("tipoOperacao") TipoOperacao tipoOperacao,
            @Param("faixaEtaria") FaixaEtaria faixaEtaria
    );

    /**
     * ==================================================================
     * CONSULTA DINÂMICA FLEXÍVEL COM @Query: BUSCA COM FILTROS OPCIONAIS
     * ==================================================================
     * Permite filtrar o catálogo por tipo de operação, com filtro opcional
     * de faixa etária (caso faixaEtaria seja nulo, retorna todas as faixas)
     * e busca textual opcional por marca/modelo.
     *
     * @param tipoOperacao Tipo da operação (VENDA ou ALUGUEL)
     * @param faixaEtaria Faixa etária opcional (pode ser null)
     * @param termo Termo de busca opcional (pode ser null ou vazio)
     * @return Lista filtrada conforme os parâmetros fornecidos
     */
    @Query("SELECT b FROM BicicletaCatalogo b WHERE " +
           "b.tipoOperacao = :tipoOperacao AND " +
           "(:faixaEtaria IS NULL OR b.faixaEtaria = :faixaEtaria) AND " +
           "(:termo IS NULL OR LOWER(b.marca) LIKE LOWER(CONCAT('%', :termo, '%')) OR LOWER(b.modelo) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
           "ORDER BY b.disponivel DESC, b.valor ASC")
    List<BicicletaCatalogo> filtrarCatalogo(
            @Param("tipoOperacao") TipoOperacao tipoOperacao,
            @Param("faixaEtaria") FaixaEtaria faixaEtaria,
            @Param("termo") String termo
    );

    /**
     * Conta quantas bicicletas de aluguel estão atualmente alugadas (disponivel = false).
     * Usado para métricas no Dashboard.
     *
     * @return Quantidade de bicicletas em locação ativa
     */
    @Query("SELECT COUNT(b) FROM BicicletaCatalogo b WHERE b.tipoOperacao = 'ALUGUEL' AND b.disponivel = false")
    long countLocacoesAtivas();

    /**
     * Conta quantas bicicletas estão disponíveis para aluguel imediato.
     *
     * @return Quantidade de bicicletas prontas para alugar
     */
    @Query("SELECT COUNT(b) FROM BicicletaCatalogo b WHERE b.tipoOperacao = 'ALUGUEL' AND b.disponivel = true")
    long countLocacoesDisponiveis();

    /**
     * Conta quantas bicicletas semi-novas estão disponíveis no estoque para venda.
     *
     * @return Quantidade em estoque de vendas
     */
    @Query("SELECT COUNT(b) FROM BicicletaCatalogo b WHERE b.tipoOperacao = 'VENDA' AND b.disponivel = true")
    long countVendasDisponiveis();
}
