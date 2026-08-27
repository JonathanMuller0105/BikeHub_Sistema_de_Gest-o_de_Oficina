package br.com.projeto.bikehub.controller.api;

import br.com.projeto.bikehub.controller.api.dto.CatalogoRequest;
import br.com.projeto.bikehub.controller.api.dto.CatalogoResponse;
import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.FaixaEtaria;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.TipoOperacao;
import br.com.projeto.bikehub.service.CatalogoService;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.dao.DataIntegrityViolationException;

/** API REST do estoque de bicicletas para venda e aluguel. */
@RestController
@RequestMapping("/api/catalogo")
public class CatalogoRestController {

    private final CatalogoService catalogoService;

    public CatalogoRestController(CatalogoService catalogoService) {
        this.catalogoService = catalogoService;
    }

    @GetMapping
    public List<CatalogoResponse> listar(
            @RequestParam(required = false) TipoOperacao tipoOperacao,
            @RequestParam(required = false) FaixaEtaria faixaEtaria) {
        return catalogoService.listarTodos().stream()
                .filter(item -> tipoOperacao == null || item.getTipoOperacao() == tipoOperacao)
                .filter(item -> faixaEtaria == null || item.getFaixaEtaria() == faixaEtaria)
                .map(CatalogoResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<CatalogoResponse> criar(@Valid @RequestBody CatalogoRequest request) {
        BicicletaCatalogo item = new BicicletaCatalogo(
                request.marca().trim(), request.modelo().trim(), request.cor().trim(), request.ano(),
                request.faixaEtaria(), request.tipo(), request.valor(), request.disponivel(),
                request.imagemUrl(), request.descricao()
        );
        BicicletaCatalogo salvo = catalogoService.salvar(item);
        return ResponseEntity.created(URI.create("/api/catalogo/" + salvo.getId()))
                .body(CatalogoResponse.from(salvo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @Valid @RequestBody CatalogoRequest request) {
        try {
            BicicletaCatalogo atualizado = catalogoService.atualizar(
                    id, request.marca(), request.modelo(), request.cor(), request.ano(),
                    request.faixaEtaria(), request.tipo(), request.valor(), request.disponivel(),
                    request.imagemUrl(), request.descricao());
            return ResponseEntity.ok(CatalogoResponse.from(atualizado));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(Map.of("mensagem", exception.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        try {
            catalogoService.excluir(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(404).body(Map.of("mensagem", exception.getMessage()));
        } catch (DataIntegrityViolationException exception) {
            return ResponseEntity.status(409).body(Map.of("mensagem", exception.getMessage()));
        }
    }
}
