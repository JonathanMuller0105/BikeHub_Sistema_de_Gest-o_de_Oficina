package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.controller.api.dto.DevolucaoRequest;
import br.com.projeto.bikehub.entity.Aluguel;
import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.Venda;
import br.com.projeto.bikehub.service.AluguelService;
import br.com.projeto.bikehub.service.CatalogoService;
import br.com.projeto.bikehub.service.UsuarioService;
import br.com.projeto.bikehub.service.VendaService;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class TransacaoMvcController {
    private final CatalogoService catalogoService;
    private final VendaService vendaService;
    private final AluguelService aluguelService;
    private final UsuarioService usuarioService;

    public TransacaoMvcController(CatalogoService catalogoService, VendaService vendaService,
                                  AluguelService aluguelService, UsuarioService usuarioService) {
        this.catalogoService = catalogoService;
        this.vendaService = vendaService;
        this.aluguelService = aluguelService;
        this.usuarioService = usuarioService;
    }

    @GetMapping("/vendas/{id}/confirmar")
    public String confirmarVenda(@PathVariable Long id, HttpSession session, Model model) {
        if (!autenticado(session)) return "redirect:/login";
        model.addAttribute("bicicleta", buscarBike(id));
        model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
        return "vendas/formulario";
    }

    @PostMapping("/vendas/{id}/finalizar")
    public String finalizarVenda(@PathVariable Long id, @RequestParam String clienteNome,
            @RequestParam String clienteCpf, @RequestParam String clienteTelefone,
            @RequestParam(required = false) String clienteEmail,
            @RequestParam(defaultValue = "0") BigDecimal desconto,
            @RequestParam String formaPagamento, @RequestParam(required = false) Integer parcelas,
            HttpSession session, RedirectAttributes redirect) {
        if (!autenticado(session)) return "redirect:/login";
        try {
            BicicletaCatalogo bike = buscarBike(id);
            Venda venda = new Venda();
            venda.setClienteNome(clienteNome); venda.setClienteCpf(clienteCpf);
            venda.setClienteTelefone(clienteTelefone); venda.setClienteEmail(clienteEmail);
            venda.setValorOriginal(bike.getValor()); venda.setDesconto(desconto);
            venda.setValorFinal(bike.getValor().subtract(desconto));
            venda.setFormaPagamento(formaPagamento); venda.setParcelas(parcelas);
            venda.setDataVenda(LocalDate.now()); venda.setGarantiaMeses(6);
            Venda salva = vendaService.registrarVenda(id, venda);
            redirect.addFlashAttribute("mensagemSucesso", "Venda #" + salva.getId() + " salva no histórico.");
            return "redirect:/vendas/historico";
        } catch (Exception e) {
            redirect.addFlashAttribute("mensagemErro", e.getMessage());
            return "redirect:/vendas";
        }
    }

    @GetMapping("/vendas/historico")
    public String historicoVendas(HttpSession session, Model model) {
        if (!autenticado(session)) return "redirect:/login";
        model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
        model.addAttribute("vendas", vendaService.listarTodas());
        return "vendas/historico";
    }

    @GetMapping("/aluguel/{id}/confirmar")
    public String confirmarAluguel(@PathVariable Long id, HttpSession session, Model model) {
        if (!autenticado(session)) return "redirect:/login";
        model.addAttribute("bicicleta", buscarBike(id));
        model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
        model.addAttribute("hoje", LocalDate.now());
        return "aluguel/formulario";
    }

    @PostMapping("/aluguel/{id}/finalizar")
    public String finalizarAluguel(@PathVariable Long id, @RequestParam String clienteNome,
            @RequestParam String clienteCpf, @RequestParam String clienteTelefone,
            @RequestParam(required = false) String clienteEmail, @RequestParam LocalDate dataRetirada,
            @RequestParam LocalDate dataDevolucaoPrevista, @RequestParam Integer quantidadeDiarias,
            @RequestParam BigDecimal valorCaucao, @RequestParam String formaPagamento,
            HttpSession session, RedirectAttributes redirect) {
        if (!autenticado(session)) return "redirect:/login";
        try {
            BicicletaCatalogo bike = buscarBike(id);
            Aluguel aluguel = new Aluguel();
            aluguel.setCodigoContrato("BH-" + System.currentTimeMillis());
            aluguel.setClienteNome(clienteNome); aluguel.setClienteCpf(clienteCpf);
            aluguel.setClienteTelefone(clienteTelefone); aluguel.setClienteEmail(clienteEmail);
            aluguel.setDataRetirada(dataRetirada); aluguel.setHoraRetirada(LocalTime.now().withSecond(0).withNano(0));
            aluguel.setDataDevolucaoPrevista(dataDevolucaoPrevista); aluguel.setHoraDevolucaoPrevista(LocalTime.of(18, 0));
            aluguel.setQuantidadeDiarias(quantidadeDiarias); aluguel.setValorDiaria(bike.getValor());
            aluguel.setValorTotal(bike.getValor().multiply(BigDecimal.valueOf(quantidadeDiarias)));
            aluguel.setValorCaucao(valorCaucao); aluguel.setFormaPagamento(formaPagamento);
            aluguel.setDataCriacao(LocalDate.now());
            Aluguel salvo = aluguelService.registrarAluguel(id, aluguel);
            redirect.addFlashAttribute("mensagemSucesso", "Contrato " + salvo.getCodigoContrato() + " salvo.");
            return "redirect:/aluguel/historico";
        } catch (Exception e) {
            redirect.addFlashAttribute("mensagemErro", e.getMessage());
            return "redirect:/aluguel";
        }
    }

    @GetMapping("/aluguel/historico")
    public String historicoAlugueis(HttpSession session, Model model) {
        if (!autenticado(session)) return "redirect:/login";
        model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
        model.addAttribute("alugueis", aluguelService.listarTodos());
        return "aluguel/historico";
    }

    @PostMapping("/aluguel/historico/{id}/devolver")
    public String devolver(@PathVariable Long id, @RequestParam BigDecimal valorCaucaoDevolvido,
            @RequestParam(defaultValue = "0") BigDecimal taxaAvariaOuAtraso,
            @RequestParam(required = false) String motivoTaxa, HttpSession session,
            RedirectAttributes redirect) {
        if (!autenticado(session)) return "redirect:/login";
        try {
            aluguelService.registrarDevolucao(id, new DevolucaoRequest(LocalDate.now(), LocalTime.now(),
                    valorCaucaoDevolvido, taxaAvariaOuAtraso, motivoTaxa, "MESMO_MEIO",
                    "Devolução registrada no MVC"));
            redirect.addFlashAttribute("mensagemSucesso", "Devolução registrada com sucesso.");
        } catch (Exception e) {
            redirect.addFlashAttribute("mensagemErro", e.getMessage());
        }
        return "redirect:/aluguel/historico";
    }

    private boolean autenticado(HttpSession session) { return usuarioService.isUsuarioLogado(session); }
    private BicicletaCatalogo buscarBike(Long id) {
        return catalogoService.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Bicicleta não encontrada."));
    }
}
