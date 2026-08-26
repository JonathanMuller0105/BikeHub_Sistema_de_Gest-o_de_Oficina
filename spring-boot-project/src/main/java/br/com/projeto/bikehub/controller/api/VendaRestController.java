package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.VendaRequest;
import br.com.projeto.bikehub.controller.api.dto.VendaResponse;
import br.com.projeto.bikehub.entity.Venda;
import br.com.projeto.bikehub.service.VendaService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** API REST do histórico de vendas. */
@RestController
@RequestMapping("/api/vendas")
public class VendaRestController {

    private final VendaService vendaService;

    public VendaRestController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @GetMapping
    public List<VendaResponse> listar() {
        return vendaService.listarTodas().stream().map(VendaResponse::from).toList();
    }

    @PostMapping
    public ResponseEntity<VendaResponse> registrar(@Valid @RequestBody VendaRequest request) {
        Venda venda = new Venda();
        venda.setClienteNome(request.clienteNome());
        venda.setClienteCpf(request.clienteCpf());
        venda.setClienteTelefone(request.clienteTelefone());
        venda.setClienteEmail(request.clienteEmail());
        venda.setValorOriginal(request.valorOriginal());
        venda.setDesconto(request.desconto());
        venda.setValorFinal(request.valorFinal());
        venda.setFormaPagamento(request.formaPagamento());
        venda.setParcelas(request.parcelas());
        venda.setDataVenda(request.dataVenda());
        venda.setGarantiaMeses(request.garantiaMeses());
        Venda salva = vendaService.registrarVenda(request.bicicletaId(), venda);
        return ResponseEntity.created(URI.create("/api/vendas/" + salva.getId()))
                .body(VendaResponse.from(salva));
    }
}
