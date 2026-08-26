package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.AluguelRequest;
import br.com.projeto.bikehub.controller.api.dto.AluguelResponse;
import br.com.projeto.bikehub.controller.api.dto.DevolucaoRequest;
import br.com.projeto.bikehub.entity.Aluguel;
import br.com.projeto.bikehub.service.AluguelService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** API REST de emissão de contratos e registro de devoluções. */
@RestController
@RequestMapping("/api/alugueis")
public class AluguelRestController {

    private final AluguelService aluguelService;

    public AluguelRestController(AluguelService aluguelService) {
        this.aluguelService = aluguelService;
    }

    @GetMapping
    public List<AluguelResponse> listar() {
        return aluguelService.listarTodos().stream().map(AluguelResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<AluguelResponse> registrar(@Valid @RequestBody AluguelRequest request) {
        Aluguel aluguel = new Aluguel();
        aluguel.setCodigoContrato(request.codigoContrato());
        aluguel.setClienteNome(request.clienteNome());
        aluguel.setClienteCpf(request.clienteCpf());
        aluguel.setClienteTelefone(request.clienteTelefone());
        aluguel.setClienteEmail(request.clienteEmail());
        aluguel.setClienteEndereco(request.clienteEndereco());
        aluguel.setDataRetirada(request.dataRetirada());
        aluguel.setHoraRetirada(request.horaRetirada());
        aluguel.setDataDevolucaoPrevista(request.dataDevolucaoPrevista());
        aluguel.setHoraDevolucaoPrevista(request.horaDevolucaoPrevista());
        aluguel.setQuantidadeDiarias(request.quantidadeDiarias());
        aluguel.setValorDiaria(request.valorDiaria());
        aluguel.setValorTotal(request.valorTotal());
        aluguel.setValorCaucao(request.valorCaucao());
        aluguel.setFormaPagamento(request.formaPagamento());
        aluguel.setAcessorios(request.acessorios() == null ? null : String.join("\n", request.acessorios()));
        aluguel.setDataCriacao(request.dataCriacao());
        Aluguel salvo = aluguelService.registrarAluguel(request.bicicletaId(), aluguel);
        return ResponseEntity.created(URI.create("/api/alugueis/" + salvo.getId()))
                .body(AluguelResponse.from(salvo));
    }

    @PatchMapping("/{id}/devolucao")
    public AluguelResponse devolver(@PathVariable Long id, @Valid @RequestBody DevolucaoRequest request) {
        return AluguelResponse.from(aluguelService.registrarDevolucao(id, request));
    }
}
