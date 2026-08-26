package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.FaixaEtaria;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.TipoOperacao;
import br.com.projeto.bikehub.repository.BicicletaCatalogoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ======================================================================
 * SERVIÇO: CATÁLOGO DE VENDAS E ALUGUEL (br.com.projeto.bikehub.service.CatalogoService)
 * ======================================================================
 * Gerencia a exibição, busca, filtragem por faixa etária, controle de estoque
 * e transações comerciais para:
 * 1. VENDA: Bicicletas semi-novas.
 * 2. ALUGUEL: Frota de bicicletas para locação por diária.
 */
@Service
public class CatalogoService {

    private final BicicletaCatalogoRepository catalogoRepository;

    @Autowired
    public CatalogoService(BicicletaCatalogoRepository catalogoRepository) {
        this.catalogoRepository = catalogoRepository;
    }

    /** Retorna todos os itens do catálogo para consumo da API React. */
    @Transactional(readOnly = true)
    public List<BicicletaCatalogo> listarTodos() {
        return catalogoRepository.findAll();
    }

    /**
     * Retorna o catálogo de semi-novas para VENDA com filtros opcionais de faixa etária e busca.
     *
     * @param faixaEtaria Faixa etária (INFANTIL, JUVENIL, ADULTO ou null para todas)
     * @param termo Termo de busca por marca/modelo
     * @return Lista de bicicletas filtradas
     */
    @Transactional(readOnly = true)
    public List<BicicletaCatalogo> listarVendas(FaixaEtaria faixaEtaria, String termo) {
        return catalogoRepository.filtrarCatalogo(TipoOperacao.VENDA, faixaEtaria, termo);
    }

    /**
     * Retorna a frota de bicicletas para ALUGUEL com filtros opcionais de faixa etária e busca.
     *
     * @param faixaEtaria Faixa etária (INFANTIL, JUVENIL, ADULTO ou null para todas)
     * @param termo Termo de busca
     * @return Lista de bicicletas para locação
     */
    @Transactional(readOnly = true)
    public List<BicicletaCatalogo> listarAluguel(FaixaEtaria faixaEtaria, String termo) {
        return catalogoRepository.filtrarCatalogo(TipoOperacao.ALUGUEL, faixaEtaria, termo);
    }

    /**
     * Busca um item do catálogo por ID.
     *
     * @param id ID da bicicleta no catálogo
     * @return Optional contendo o item
     */
    @Transactional(readOnly = true)
    public Optional<BicicletaCatalogo> buscarPorId(Long id) {
        return catalogoRepository.findById(id);
    }

    /**
     * Salva ou atualiza um item no catálogo.
     *
     * @param item Objeto BicicletaCatalogo
     * @return Item persistido
     */
    @Transactional
    public BicicletaCatalogo salvar(BicicletaCatalogo item) {
        return catalogoRepository.save(item);
    }

    /**
     * Registra a venda de uma bicicleta semi-nova:
     * Altera a flag de disponibilidade para 'false' para retirá-la das listagens ativas.
     *
     * @param id ID da bicicleta vendida
     * @return Bicicleta atualizada
     */
    @Transactional
    public BicicletaCatalogo registrarVenda(Long id) {
        BicicletaCatalogo item = catalogoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Item de venda não encontrado com ID: " + id));

        if (!item.getDisponivel()) {
            throw new IllegalStateException("Esta bicicleta já foi vendida ou está indisponível.");
        }

        item.setDisponivel(false);
        return catalogoRepository.save(item);
    }

    /**
     * Realiza a locação de uma bicicleta:
     * Marca a bicicleta como indisponível (em uso).
     *
     * @param id ID da bicicleta alugada
     * @return Bicicleta atualizada
     */
    @Transactional
    public BicicletaCatalogo realizarAluguel(Long id) {
        BicicletaCatalogo item = catalogoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bicicleta de aluguel não encontrada com ID: " + id));

        if (!item.getDisponivel()) {
            throw new IllegalStateException("Esta bicicleta já está alugada no momento.");
        }

        item.setDisponivel(false);
        return catalogoRepository.save(item);
    }

    /**
     * Registra a devolução de uma bicicleta alugada, tornando-a disponível novamente.
     *
     * @param id ID da bicicleta devolvida
     * @return Bicicleta atualizada
     */
    @Transactional
    public BicicletaCatalogo registrarDevolucao(Long id) {
        BicicletaCatalogo item = catalogoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Bicicleta não encontrada com ID: " + id));

        item.setDisponivel(true);
        return catalogoRepository.save(item);
    }

    /**
     * Obtém as métricas comerciais de vendas e locações para o Dashboard.
     *
     * @return Mapa com total de locações ativas, disponíveis e estoque de vendas
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obterMetricasComerciais() {
        Map<String, Object> metricas = new HashMap<>();

        long locacoesAtivas = catalogoRepository.countLocacoesAtivas();
        long locacoesDisponiveis = catalogoRepository.countLocacoesDisponiveis();
        long vendasDisponiveis = catalogoRepository.countVendasDisponiveis();

        metricas.put("locacoesAtivas", locacoesAtivas);
        metricas.put("locacoesDisponiveis", locacoesDisponiveis);
        metricas.put("vendasDisponiveis", vendasDisponiveis);

        return metricas;
    }
}
