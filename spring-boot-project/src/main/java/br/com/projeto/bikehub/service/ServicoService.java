package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.Bicicleta;
import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.entity.Servico;
import br.com.projeto.bikehub.entity.Servico.StatusServico;
import br.com.projeto.bikehub.repository.BicicletaRepository;
import br.com.projeto.bikehub.repository.ClienteRepository;
import br.com.projeto.bikehub.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * ======================================================================
 * SERVIÇO: ORDENS DE SERVIÇO / OFICINA (br.com.projeto.bikehub.service.ServicoService)
 * ======================================================================
 * Centraliza as regras de negócio para abertura, manutenção, cálculo de métricas
 * e transição de status das Ordens de Serviço (OS) na oficina BikeHub.
 */
@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;
    private final ClienteRepository clienteRepository;
    private final BicicletaRepository bicicletaRepository;

    @Autowired
    public ServicoService(ServicoRepository servicoRepository,
                          ClienteRepository clienteRepository,
                          BicicletaRepository bicicletaRepository) {
        this.servicoRepository = servicoRepository;
        this.clienteRepository = clienteRepository;
        this.bicicletaRepository = bicicletaRepository;
    }

    /**
     * Retorna todas as ordens de serviço com dados de cliente e bicicleta carregados.
     *
     * @return Lista completa de OS
     */
    @Transactional(readOnly = true)
    public List<Servico> listarTodas() {
        return servicoRepository.findAllWithDetails();
    }

    /**
     * Busca uma ordem de serviço pelo ID com validação de existência.
     *
     * @param id ID da OS
     * @return Optional contendo a OS
     */
    @Transactional(readOnly = true)
    public Optional<Servico> buscarPorId(Long id) {
        return servicoRepository.findById(id);
    }

    /**
     * Retorna as ordens de serviço filtradas por um determinado status.
     *
     * @param status Status a filtrar (ex: PENDENTE, EM_MANUTENCAO)
     * @return Lista de OS correspondentes
     */
    @Transactional(readOnly = true)
    public List<Servico> listarPorStatus(StatusServico status) {
        return servicoRepository.findByStatusOrderByDataEntregaAsc(status);
    }

    /**
     * Cria e persiste uma nova Ordem de Serviço vinculando cliente e bicicleta.
     *
     * @param clienteId ID do cliente solicitante
     * @param bicicletaId ID da bicicleta a ser reparada
     * @param descricao Detalhamento técnico do serviço
     * @param valor Preço total orçado
     * @param dataEntrega Data prevista de conclusão
     * @return Objeto Servico persistido no banco
     */
    @Transactional
    public Servico abrirOrdemServico(Long clienteId, Long bicicletaId, String descricao, BigDecimal valor, LocalDate dataEntrega) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com ID: " + clienteId));

        Bicicleta bicicleta = bicicletaRepository.findById(bicicletaId)
                .orElseThrow(() -> new IllegalArgumentException("Bicicleta não encontrada com ID: " + bicicletaId));

        // Validação de negócio: A bicicleta deve pertencer ao cliente selecionado
        if (!bicicleta.getCliente().getId().equals(cliente.getId())) {
            throw new IllegalArgumentException("A bicicleta selecionada não pertence ao cliente informado.");
        }

        Servico servico = new Servico(cliente, bicicleta, descricao, valor, dataEntrega, StatusServico.PENDENTE);
        return servicoRepository.save(servico);
    }

    /**
     * Salva ou atualiza uma Ordem de Serviço completa.
     *
     * @param servico Objeto Servico validado
     * @return Servico persistido
     */
    @Transactional
    public Servico salvar(Servico servico) {
        return servicoRepository.save(servico);
    }

    /** Atualiza os dados editáveis da OS sem alterar seu ID, vínculo ou status. */
    @Transactional
    public Servico atualizar(Long id, String descricao, BigDecimal valor, LocalDate dataEntrega) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ordem de Serviço não encontrada com ID: " + id));
        servico.setDescricao(descricao.trim());
        servico.setValor(valor);
        servico.setDataEntrega(dataEntrega);
        return servicoRepository.save(servico);
    }

    /**
     * Atualiza o status de execução de uma Ordem de Serviço.
     * Método chave utilizado tanto pelas rotas tradicionais quanto por chamadas AJAX/JavaScript.
     *
     * @param id ID da Ordem de Serviço
     * @param novoStatus Novo status (PENDENTE, EM_ANALISE, EM_MANUTENCAO, PRONTO_PARA_RETIRADA, ENTREGUE)
     * @return Servico atualizado
     */
    @Transactional
    public Servico atualizarStatus(Long id, StatusServico novoStatus) {
        Servico servico = servicoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ordem de Serviço não encontrada com ID: " + id));

        // Atualiza a transição de estado da OS
        servico.setStatus(novoStatus);
        return servicoRepository.save(servico);
    }

    /**
     * Exclui uma Ordem de Serviço pelo identificador.
     *
     * @param id ID da OS
     */
    @Transactional
    public void excluir(Long id) {
        servicoRepository.deleteById(id);
    }

    /**
     * Calcula as métricas agregadas das Ordens de Serviço para alimentar o Dashboard.
     *
     * @return Mapa com as contagens por status e totais
     */
    @Transactional(readOnly = true)
    public Map<String, Object> obterMetricasOficina() {
        Map<String, Object> metricas = new HashMap<>();

        long pendentes = servicoRepository.countByStatus(StatusServico.PENDENTE);
        long emAnalise = servicoRepository.countByStatus(StatusServico.EM_ANALISE);
        long emManutencao = servicoRepository.countByStatus(StatusServico.EM_MANUTENCAO);
        long prontoRetirada = servicoRepository.countByStatus(StatusServico.PRONTO_PARA_RETIRADA);
        long entregues = servicoRepository.countByStatus(StatusServico.ENTREGUE);

        long totalAtivas = pendentes + emAnalise + emManutencao + prontoRetirada;
        BigDecimal faturamentoTotal = servicoRepository.somarFaturamentoServicosEntregues();

        metricas.put("pendentes", pendentes);
        metricas.put("emAnalise", emAnalise);
        metricas.put("emManutencao", emManutencao);
        metricas.put("prontoRetirada", prontoRetirada);
        metricas.put("entregues", entregues);
        metricas.put("totalAtivas", totalAtivas);
        metricas.put("faturamentoTotal", faturamentoTotal);

        return metricas;
    }

    /**
     * Retorna a lista de atividades recentes para o painel principal.
     *
     * @return 5 OS mais recentes
     */
    @Transactional(readOnly = true)
    public List<Servico> listarAtividadesRecentes() {
        return servicoRepository.findRecentActivities();
    }
}
