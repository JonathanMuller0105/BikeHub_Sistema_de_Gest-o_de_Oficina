package br.com.projeto.bikehub.service;

import br.com.projeto.bikehub.controller.api.dto.DevolucaoRequest;
import br.com.projeto.bikehub.entity.Aluguel;
import br.com.projeto.bikehub.entity.Aluguel.StatusAluguel;
import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.repository.AluguelRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Coordena contratos, devoluções e disponibilidade da frota. */
@Service
public class AluguelService {

    private final AluguelRepository aluguelRepository;
    private final CatalogoService catalogoService;

    public AluguelService(AluguelRepository aluguelRepository, CatalogoService catalogoService) {
        this.aluguelRepository = aluguelRepository;
        this.catalogoService = catalogoService;
    }

    @Transactional(readOnly = true)
    public List<Aluguel> listarTodos() {
        return aluguelRepository.findAllByOrderByDataCriacaoDescIdDesc();
    }

    @Transactional
    public Aluguel registrarAluguel(Long bicicletaId, Aluguel aluguel) {
        BicicletaCatalogo bicicleta = catalogoService.buscarPorId(bicicletaId)
                .orElseThrow(() -> new IllegalArgumentException("Bicicleta não encontrada no catálogo."));
        if (bicicleta.getTipoOperacao() != BicicletaCatalogo.TipoOperacao.ALUGUEL) {
            throw new IllegalArgumentException("A bicicleta informada não pertence à frota de aluguel.");
        }
        aluguel.setBicicleta(bicicleta);
        aluguel.setStatus(StatusAluguel.EM_ANDAMENTO);
        catalogoService.realizarAluguel(bicicletaId);
        return aluguelRepository.save(aluguel);
    }

    @Transactional
    public Aluguel registrarDevolucao(Long id, DevolucaoRequest dados) {
        Aluguel aluguel = aluguelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contrato de aluguel não encontrado."));
        aluguel.setDataDevolucaoEfetiva(dados.dataDevolucaoEfetiva());
        aluguel.setHoraDevolucaoEfetiva(dados.horaDevolucaoEfetiva());
        aluguel.setValorCaucaoDevolvido(dados.valorCaucaoDevolvido());
        aluguel.setTaxaAvariaOuAtraso(dados.taxaAvariaOuAtraso());
        aluguel.setMotivoTaxa(dados.motivoTaxa());
        aluguel.setMetodoDevolucaoCaucao(dados.metodoDevolucaoCaucao());
        aluguel.setObservacaoDevolucao(dados.observacaoDevolucao());
        aluguel.setStatus(StatusAluguel.DEVOLVIDO);
        catalogoService.registrarDevolucao(aluguel.getBicicleta().getId());
        return aluguelRepository.save(aluguel);
    }
}
