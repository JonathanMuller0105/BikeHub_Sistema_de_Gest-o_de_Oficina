package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.ClienteRequest;
import br.com.projeto.bikehub.controller.api.dto.ClienteResponse;
import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.service.ClienteService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * API REST consumida pelo front-end React para listar, cadastrar e excluir clientes.
 *
 * Este controller é separado do ClienteController MVC para preservar integralmente
 * o fluxo existente de páginas Thymeleaf e reutiliza todas as regras do ClienteService.
 */
@RestController
@RequestMapping("/api/clientes")
public class ClienteRestController {

    private final ClienteService clienteService;

    public ClienteRestController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    /** Lista os clientes persistidos e inclui suas bicicletas no JSON de resposta. */
    @GetMapping
    public List<ClienteResponse> listarClientes() {
        return clienteService.listarTodos().stream()
                .map(cliente -> ClienteResponse.from(
                        cliente,
                        clienteService.listarBicicletasDoCliente(cliente.getId())
                ))
                .toList();
    }

    /**
     * Realiza o cadastro integrado de cliente e bicicleta.
     * Retorna HTTP 201 quando a gravação é concluída e HTTP 409 para conflitos de dados.
     */
    @PostMapping
    public ResponseEntity<?> criarCliente(@Valid @RequestBody ClienteRequest request) {
        try {
            Cliente cliente = new Cliente(
                    request.nome().trim(),
                    request.telefone().trim(),
                    request.email().trim(),
                    textoOpcional(request.cpf())
            );

            Cliente clienteSalvo = clienteService.salvarCadastroIntegrado(
                    cliente,
                    request.marca(),
                    request.modelo(),
                    request.cor(),
                    request.ano(),
                    request.numeroSerie()
            );

            ClienteResponse response = ClienteResponse.from(
                    clienteSalvo,
                    clienteService.listarBicicletasDoCliente(clienteSalvo.getId())
            );

            return ResponseEntity
                    .created(URI.create("/api/clientes/" + clienteSalvo.getId()))
                    .body(response);
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(409).body(Map.of(
                    "mensagem", "Não foi possível cadastrar o cliente. Verifique se o e-mail já está em uso."
            ));
        }
    }

    /** Atualiza dados cadastrais e uma bicicleta selecionada, preservando os IDs. */
    @PutMapping("/{id}")
    public ResponseEntity<?> atualizarCliente(@PathVariable Long id, @Valid @RequestBody ClienteRequest request) {
        try {
            Cliente atualizado = clienteService.atualizarCadastroIntegrado(
                    id, request.nome(), request.telefone(), request.email(), request.cpf(),
                    request.bicicletaId(), request.marca(), request.modelo(), request.cor(),
                    request.ano(), request.numeroSerie());
            return ResponseEntity.ok(ClienteResponse.from(
                    atualizado, clienteService.listarBicicletasDoCliente(atualizado.getId())));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(Map.of("mensagem", exception.getMessage()));
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(409).body(Map.of(
                    "mensagem", "Não foi possível atualizar o cliente. Verifique se o e-mail já está em uso."));
        }
    }

    /**
     * Exclui o cliente informado.
     * A remoção só retorna sucesso depois que o ClienteService confirma a operação.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluirCliente(@PathVariable Long id) {
        if (clienteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("mensagem", "Cliente não encontrado."));
        }

        try {
            clienteService.excluirCliente(id);
            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(409).body(Map.of(
                    "mensagem", "Não foi possível excluir o cliente porque existem ordens de serviço vinculadas."
            ));
        }
    }

    /** Normaliza campos opcionais vazios para nulo antes da persistência. */
    private String textoOpcional(String valor) {
        return valor == null || valor.isBlank() ? null : valor.trim();
    }
}
