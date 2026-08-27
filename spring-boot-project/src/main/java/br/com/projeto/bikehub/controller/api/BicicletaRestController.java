package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.BicicletaRequest;
import br.com.projeto.bikehub.controller.api.dto.BicicletaResponse;
import br.com.projeto.bikehub.entity.Bicicleta;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
public class BicicletaRestController {

    private final ClienteService clienteService;

    public BicicletaRestController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping("/api/clientes/{clienteId}/bicicletas")
    public ResponseEntity<?> listar(@PathVariable Long clienteId) {
        if (clienteService.buscarPorId(clienteId).isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("mensagem", "Cliente não encontrado."));
        }
        List<BicicletaResponse> bicicletas = clienteService.listarBicicletasDoCliente(clienteId)
                .stream().map(BicicletaResponse::from).toList();
        return ResponseEntity.ok(bicicletas);
    }

    @PostMapping("/api/clientes/{clienteId}/bicicletas")
    public ResponseEntity<?> criar(@PathVariable Long clienteId, @Valid @RequestBody BicicletaRequest request) {
        try {
            Bicicleta bicicleta = paraEntidade(request);
            Bicicleta salva = clienteService.adicionarBicicletaAoCliente(clienteId, bicicleta);
            return ResponseEntity.created(URI.create("/api/bicicletas/" + salva.getId()))
                    .body(BicicletaResponse.from(salva));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(Map.of("mensagem", exception.getMessage()));
        }
    }

    @PutMapping("/api/bicicletas/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody BicicletaRequest request) {
        try {
            return ResponseEntity.ok(BicicletaResponse.from(
                    clienteService.atualizarBicicleta(id, paraEntidade(request))));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(Map.of("mensagem", exception.getMessage()));
        }
    }

    @DeleteMapping("/api/bicicletas/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            clienteService.excluirBicicleta(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(Map.of("mensagem", exception.getMessage()));
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(409).body(Map.of("mensagem", exception.getMessage()));
        }
    }

    private Bicicleta paraEntidade(BicicletaRequest request) {
        Bicicleta bicicleta = new Bicicleta();
        bicicleta.setMarca(request.marca());
        bicicleta.setModelo(request.modelo());
        bicicleta.setCor(request.cor());
        bicicleta.setAno(request.ano());
        bicicleta.setNumeroSerie(request.numeroSerie());
        return bicicleta;
    }
}
