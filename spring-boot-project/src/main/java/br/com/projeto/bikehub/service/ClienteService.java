package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.Bicicleta;
import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.repository.BicicletaRepository;
import br.com.projeto.bikehub.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * ======================================================================
 * SERVIÇO: GESTÃO DE CLIENTES E BICICLETAS (br.com.projeto.bikehub.service.ClienteService)
 * ======================================================================
 * Encapsula a lógica de negócio para o cadastro integrado de clientes
 * e suas bicicletas associadas, consultas, atualizações e exclusões.
 */
@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final BicicletaRepository bicicletaRepository;

    @Autowired
    public ClienteService(ClienteRepository clienteRepository, BicicletaRepository bicicletaRepository) {
        this.clienteRepository = clienteRepository;
        this.bicicletaRepository = bicicletaRepository;
    }

    /**
     * Retorna a lista de todos os clientes em ordem alfabética de nome.
     *
     * @return Lista completa de clientes cadastrados
     */
    @Transactional(readOnly = true)
    public List<Cliente> listarTodos() {
        return clienteRepository.findAllByOrderByNomeAsc();
    }

    /**
     * Busca um cliente pelo seu identificador único.
     *
     * @param id ID do cliente
     * @return Optional contendo o cliente se encontrado
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    /**
     * Busca um cliente e carrega suas bicicletas registradas.
     *
     * @param id ID do cliente
     * @return Optional com o cliente e coleção de bicicletas
     */
    @Transactional(readOnly = true)
    public Optional<Cliente> buscarPorIdComBicicletas(Long id) {
        return clienteRepository.findByIdWithBicicletas(id);
    }

    /**
     * Realiza a pesquisa de clientes por termo (nome, e-mail ou telefone).
     *
     * @param termo Texto pesquisado
     * @return Lista de clientes encontrados
     */
    @Transactional(readOnly = true)
    public List<Cliente> pesquisar(String termo) {
        if (termo == null || termo.trim().isEmpty()) {
            return listarTodos();
        }
        return clienteRepository.pesquisarPorTermo(termo.trim());
    }

    /**
     * Salva ou atualiza os dados cadastrais de um cliente.
     *
     * @param cliente Objeto Cliente validado
     * @return Cliente persistido
     */
    @Transactional
    public Cliente salvarCliente(Cliente cliente) {
        return clienteRepository.save(cliente);
    }

    /**
     * Realiza o cadastro integrado: salva o Cliente e, caso fornecidos os dados
     * técnicos da bicicleta na mesma tela, associa e persiste a Bicicleta no mesmo fluxo transacional.
     *
     * @param cliente Dados do cliente
     * @param marcaBicicleta Marca da bicicleta (opcional)
     * @param modeloBicicleta Modelo da bicicleta (opcional)
     * @param corBicicleta Cor da bicicleta (opcional)
     * @param anoBicicleta Ano de fabricação (opcional)
     * @param numeroSerie Número de série (opcional)
     * @return Cliente salvo com a bicicleta vinculada
     */
    @Transactional
    public Cliente salvarCadastroIntegrado(Cliente cliente,
                                          String marcaBicicleta,
                                          String modeloBicicleta,
                                          String corBicicleta,
                                          Integer anoBicicleta,
                                          String numeroSerie) {
        // 1. Salva o cliente primeiro para gerar o ID relacional
        Cliente clienteSalvo = clienteRepository.save(cliente);

        // 2. Verifica se foram preenchidos os dados da bicicleta no formulário integrado
        if (marcaBicicleta != null && !marcaBicicleta.trim().isEmpty() &&
            modeloBicicleta != null && !modeloBicicleta.trim().isEmpty()) {

            Bicicleta bicicleta = new Bicicleta(
                    clienteSalvo,
                    marcaBicicleta.trim(),
                    modeloBicicleta.trim(),
                    (corBicicleta != null && !corBicicleta.trim().isEmpty()) ? corBicicleta.trim() : "Não especificada",
                    (anoBicicleta != null && anoBicicleta > 1900) ? anoBicicleta : 2023,
                    (numeroSerie != null) ? numeroSerie.trim() : null
            );

            // Associa a bicicleta ao cliente e salva no banco
            clienteSalvo.adicionarBicicleta(bicicleta);
            bicicletaRepository.save(bicicleta);
        }

        return clienteSalvo;
    }

    /**
     * Cadastra uma nova bicicleta avulsa para um cliente já existente.
     *
     * @param clienteId ID do cliente proprietário
     * @param bicicleta Objeto com os dados técnicos da bicicleta
     * @return Bicicleta cadastrada
     */
    @Transactional
    public Bicicleta adicionarBicicletaAoCliente(Long clienteId, Bicicleta bicicleta) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado com o ID: " + clienteId));

        bicicleta.setCliente(cliente);
        return bicicletaRepository.save(bicicleta);
    }

    /**
     * Retorna a lista de bicicletas de um cliente específico.
     *
     * @param clienteId ID do cliente
     * @return Lista de bicicletas
     */
    @Transactional(readOnly = true)
    public List<Bicicleta> listarBicicletasDoCliente(Long clienteId) {
        return bicicletaRepository.findByClienteIdOrderByModeloAsc(clienteId);
    }

    /**
     * Exclui um cliente e suas bicicletas associadas por cascata.
     *
     * @param id ID do cliente a excluir
     */
    @Transactional
    public void excluirCliente(Long id) {
        clienteRepository.deleteById(id);
    }

    /**
     * Conta o total de clientes cadastrados no sistema.
     *
     * @return Quantidade total de clientes
     */
    @Transactional(readOnly = true)
    public long contarTotalClientes() {
        return clienteRepository.count();
    }
}
