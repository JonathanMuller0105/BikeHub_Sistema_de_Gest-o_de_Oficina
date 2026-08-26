package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.entity.BicicletaCatalogo.FaixaEtaria;
import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.service.CatalogoService;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

/**
 * ======================================================================
 * CONTROLADOR: CATÁLOGOS COMERCIAIS (br.com.projeto.bikehub.controller.CatalogoController)
 * ======================================================================
 * Gerencia as rotas e exibições dos módulos comerciais:
 * 1. /vendas: Catálogo de bicicletas semi-novas com filtros por faixa etária e botão "Registrar Venda".
 * 2. /aluguel: Catálogo de frota para locação diária com filtros e botão "Alugar Agora".
 */
@Controller
public class CatalogoController {

    private final CatalogoService catalogoService;
    private final UsuarioService usuarioService;

    @Autowired
    public CatalogoController(CatalogoService catalogoService, UsuarioService usuarioService) {
        this.catalogoService = catalogoService;
        this.usuarioService = usuarioService;
    }

    /**
     * Exibe o Catálogo de Venda de Bicicletas Semi-Novas:
     * - Suporta filtragem por faixa etária (INFANTIL, JUVENIL, ADULTO ou todas)
     * - Suporta busca textual por termo (marca ou modelo)
     * - Exibe os cartões com preço total, especificações e status de disponibilidade
     *
     * @param faixaEtaria Faixa etária selecionada no filtro superior
     * @param termo Texto pesquisado na barra de busca
     * @param session Sessão HTTP para checagem de autenticação
     * @param model Objeto Model para renderização no Thymeleaf
     * @return Template 'vendas/catalogo'
     */
    @GetMapping("/vendas")
    public String exibirCatalogoVendas(@RequestParam(value = "faixaEtaria", required = false) FaixaEtaria faixaEtaria,
                                       @RequestParam(value = "termo", required = false) String termo,
                                       HttpSession session,
                                       Model model) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        List<BicicletaCatalogo> bicicletasVenda = catalogoService.listarVendas(faixaEtaria, termo);
        model.addAttribute("bicicletas", bicicletasVenda);
        model.addAttribute("faixaSelecionada", faixaEtaria);
        model.addAttribute("todasFaixas", FaixaEtaria.values());
        model.addAttribute("termoPesquisado", termo);
        model.addAttribute("paginaAtiva", "vendas");

        return "vendas/catalogo";
    }

    /**
     * Registra a venda de uma bicicleta semi-nova do catálogo.
     *
     * @param id ID da bicicleta vendida
     * @param session Sessão HTTP
     * @param redirectAttributes Mensagens flash de confirmação
     * @return Redirecionamento de volta para o catálogo de vendas
     */
    @PostMapping("/vendas/{id}/comprar")
    public String registrarVenda(@PathVariable("id") Long id,
                                 HttpSession session,
                                 RedirectAttributes redirectAttributes) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            BicicletaCatalogo vendida = catalogoService.registrarVenda(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso",
                    "Venda registrada com sucesso! Bicicleta '" + vendida.getMarca() + " " + vendida.getModelo() + "' foi marcada como vendida.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Erro ao registrar venda: " + e.getMessage());
        }

        return "redirect:/vendas";
    }

    /**
     * Exibe o Catálogo de Locação / Aluguel de Bicicletas:
     * - Exibe os cartões com valor da diária (R$ / dia)
     * - Indicador visual se está 'Disponível' (com botão Alugar Agora) ou 'Alugada' (botão desabilitado)
     * - Filtros por faixa etária e busca
     *
     * @param faixaEtaria Filtro por faixa etária
     * @param termo Filtro de busca textual
     * @param session Sessão HTTP
     * @param model Model para o Thymeleaf
     * @return Template 'aluguel/catalogo'
     */
    @GetMapping("/aluguel")
    public String exibirCatalogoAluguel(@RequestParam(value = "faixaEtaria", required = false) FaixaEtaria faixaEtaria,
                                        @RequestParam(value = "termo", required = false) String termo,
                                        HttpSession session,
                                        Model model) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        List<BicicletaCatalogo> bicicletasAluguel = catalogoService.listarAluguel(faixaEtaria, termo);
        model.addAttribute("bicicletas", bicicletasAluguel);
        model.addAttribute("faixaSelecionada", faixaEtaria);
        model.addAttribute("todasFaixas", FaixaEtaria.values());
        model.addAttribute("termoPesquisado", termo);
        model.addAttribute("paginaAtiva", "aluguel");

        return "aluguel/catalogo";
    }

    /**
     * Realiza a locação de uma bicicleta do catálogo.
     *
     * @param id ID da bicicleta a alugar
     * @param session Sessão HTTP
     * @param redirectAttributes Mensagem flash
     * @return Redirecionamento para /aluguel
     */
    @PostMapping("/aluguel/{id}/alugar")
    public String realizarAluguel(@PathVariable("id") Long id,
                                  HttpSession session,
                                  RedirectAttributes redirectAttributes) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            BicicletaCatalogo alugada = catalogoService.realizarAluguel(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso",
                    "Locação confirmada com sucesso para a bicicleta '" + alugada.getMarca() + " " + alugada.getModelo() + "'!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Erro ao realizar locação: " + e.getMessage());
        }

        return "redirect:/aluguel";
    }

    /**
     * Registra a devolução de uma bicicleta alugada de volta para o estoque disponível.
     */
    @PostMapping("/aluguel/{id}/devolver")
    public String registrarDevolucao(@PathVariable("id") Long id,
                                     HttpSession session,
                                     RedirectAttributes redirectAttributes) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            BicicletaCatalogo devolvida = catalogoService.registrarDevolucao(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso",
                    "Devolução registrada com sucesso! A bicicleta '" + devolvida.getMarca() + " " + devolvida.getModelo() + "' está disponível para novo aluguel.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Erro ao registrar devolução: " + e.getMessage());
        }

        return "redirect:/aluguel";
    }
}
