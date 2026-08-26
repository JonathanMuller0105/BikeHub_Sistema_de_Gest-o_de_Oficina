package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.ServicoRequest;
import br.com.projeto.bikehub.controller.api.dto.ServicoResponse;
import br.com.projeto.bikehub.entity.Servico;
import br.com.projeto.bikehub.service.ServicoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** API REST de Ordens de Serviço, separada do controller MVC/Thymeleaf. */
@RestController
@RequestMapping("/api/servicos")
public class ServicoRestController {

    private final ServicoService servicoService;

    public ServicoRestController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public List<ServicoResponse> listar(@RequestParam(required = false) String status) {
        List<Servico> servicos = status == null || status.isBlank()
                ? servicoService.listarTodas()
                : servicoService.listarPorStatus(ServicoResponse.paraStatusJpa(status));
        return servicos.stream().map(ServicoResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<ServicoResponse> criar(@Valid @RequestBody ServicoRequest request) {
        Servico servico = servicoService.abrirOrdemServico(
                request.clienteId(), request.bicicletaId(), request.descricao().trim(),
                request.valor(), request.dataEntrega()
        );
        return ResponseEntity.created(URI.create("/api/servicos/" + servico.getId()))
                .body(ServicoResponse.from(servico));
    }

    @PatchMapping("/{id}/status")
    public ServicoResponse atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("O novo status é obrigatório.");
        }
        return ServicoResponse.from(servicoService.atualizarStatus(id, ServicoResponse.paraStatusJpa(status)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (servicoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        servicoService.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
