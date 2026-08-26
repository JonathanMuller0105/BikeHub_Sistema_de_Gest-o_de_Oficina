package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.Venda;
import br.com.projeto.bikehub.repository.VendaRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Coordena o histórico da venda e a baixa da bicicleta na mesma transação. */
@Service
public class VendaService {

    private final VendaRepository vendaRepository;
    private final CatalogoService catalogoService;

    public VendaService(VendaRepository vendaRepository, CatalogoService catalogoService) {
        this.vendaRepository = vendaRepository;
        this.catalogoService = catalogoService;
    }

    @Transactional(readOnly = true)
    public List<Venda> listarTodas() {
        return vendaRepository.findAllByOrderByDataVendaDescIdDesc();
    }

    @Transactional
    public Venda registrarVenda(Long bicicletaId, Venda venda) {
        BicicletaCatalogo bicicleta = catalogoService.buscarPorId(bicicletaId)
                .orElseThrow(() -> new IllegalArgumentException("Bicicleta não encontrada no catálogo."));
        if (bicicleta.getTipoOperacao() != BicicletaCatalogo.TipoOperacao.VENDA) {
            throw new IllegalArgumentException("A bicicleta informada não pertence ao catálogo de vendas.");
        }
        venda.setBicicleta(bicicleta);
        catalogoService.registrarVenda(bicicletaId);
        return vendaRepository.save(venda);
    }
}
