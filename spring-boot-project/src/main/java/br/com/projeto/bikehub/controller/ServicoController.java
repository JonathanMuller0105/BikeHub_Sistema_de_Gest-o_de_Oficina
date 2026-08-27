package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.Bicicleta;
import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.entity.Servico;
import br.com.projeto.bikehub.entity.Servico.StatusServico;
import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.service.ClienteService;
import br.com.projeto.bikehub.service.ServicoService;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ======================================================================
 * CONTROLADOR: ORDENS DE SERVIÇO (br.com.projeto.bikehub.controller.ServicoController)
 * ======================================================================
 * Controla o fluxo de trabalho da oficina mecânica:
 * - Listagem de ordens de serviço (/servicos)
 * - Formulário de abertura com seleção dinâmica de cliente e bicicleta (/servicos/novo)
 * - Atualização rápida de status (AJAX e formulário)
 * - Exclusão e visualização de detalhes da OS
 */
@Controller
@RequestMapping("/servicos")
public class ServicoController {

    private final ServicoService servicoService;
    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    @Autowired
    public ServicoController(ServicoService servicoService,
                             ClienteService clienteService,
                             UsuarioService usuarioService) {
        this.servicoService = servicoService;
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    /**
     * Exibe a listagem completa de Ordens de Serviço com filtro opcional por status.
     */
    @GetMapping
    public String listarServicos(@RequestParam(value = "status", required = false) StatusServico status,
                                 HttpSession session,
                                 Model model) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        List<Servico> servicos = (status != null) ?
                servicoService.listarPorStatus(status) :
                servicoService.listarTodas();

        model.addAttribute("servicos", servicos);
        model.addAttribute("statusSelecionado", status);
        model.addAttribute("todosStatus", StatusServico.values());
        model.addAttribute("paginaAtiva", "servicos");

        return "servicos/lista";
    }

    /**
     * Exibe o formulário de abertura de nova Ordem de Serviço.
     * Carrega a lista de clientes para alimentar o combobox inicial.
     */
    @GetMapping("/novo")
    public String exibirFormularioNovaOS(HttpSession session, Model model) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        // Lista de clientes ordenada para seleção inicial no formulário
        List<Cliente> clientes = clienteService.listarTodos();
        model.addAttribute("clientes", clientes);

        // Objeto Servico com data de entrega sugerida para 3 dias a partir de hoje
        Servico novoServico = new Servico();
        novoServico.setDataEntrega(LocalDate.now().plusDays(3));
        model.addAttribute("servico", novoServico);
        model.addAttribute("todosStatus", StatusServico.values());
        model.addAttribute("paginaAtiva", "servicos");

        return "servicos/formulario";
    }

    @GetMapping("/{id}/editar")
    public String editar(@PathVariable Long id, HttpSession session, Model model) {
        if (!usuarioService.isUsuarioLogado(session)) return "redirect:/login";
        Servico servico = servicoService.buscarPorId(id)
                .orElseThrow(() -> new IllegalArgumentException("Ordem de serviço não encontrada."));
        model.addAttribute("servico", servico);
        model.addAttribute("clientes", clienteService.listarTodos());
        model.addAttribute("bicicletasCliente", clienteService.listarBicicletasDoCliente(servico.getCliente().getId()));
        model.addAttribute("todosStatus", StatusServico.values());
        model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
        model.addAttribute("modoEdicao", true);
        return "servicos/formulario";
    }

    /**
     * Endpoint REST/AJAX: Retorna as bicicletas de um cliente específico em formato JSON
     * para atualizar dinamicamente o segundo select do formulário via JavaScript.
     *
     * @param clienteId ID do cliente selecionado
     * @return Lista de bicicletas formatadas em JSON
     */
    @GetMapping("/api/bicicletas-por-cliente/{clienteId}")
    @ResponseBody
    public ResponseEntity<List<Bicicleta>> obterBicicletasDoCliente(@PathVariable("clienteId") Long clienteId) {
        List<Bicicleta> bicicletas = clienteService.listarBicicletasDoCliente(clienteId);
        return ResponseEntity.ok(bicicletas);
    }

    /**
     * Salva uma nova Ordem de Serviço no banco de dados.
     */
    @PostMapping("/salvar")
    public String salvarServico(@RequestParam("clienteId") Long clienteId,
                                @RequestParam("bicicletaId") Long bicicletaId,
                                @RequestParam("descricao") String descricao,
                                @RequestParam("valor") BigDecimal valor,
                                @RequestParam("dataEntrega") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataEntrega,
                                 @RequestParam(value = "status", required = false) StatusServico status,
                                 @RequestParam(value = "id", required = false) Long id,
                                HttpSession session,
                                Model model,
                                RedirectAttributes redirectAttributes) {

        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            Servico servico = id == null
                    ? servicoService.abrirOrdemServico(clienteId, bicicletaId, descricao, valor, dataEntrega)
                    : servicoService.atualizar(id, descricao, valor, dataEntrega);
            if (status != null && status != StatusServico.PENDENTE) {
                servicoService.atualizarStatus(servico.getId(), status);
            }

            redirectAttributes.addFlashAttribute("mensagemSucesso", "Ordem de Serviço #" + servico.getId() + " aberta com sucesso!");
            return "redirect:/servicos";
        } catch (Exception e) {
            model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
            model.addAttribute("clientes", clienteService.listarTodos());
            model.addAttribute("todosStatus", StatusServico.values());
            model.addAttribute("mensagemErro", "Erro ao abrir OS: " + e.getMessage());
            model.addAttribute("paginaAtiva", "servicos");
            return "servicos/formulario";
        }
    }

    /**
     * Atualização rápida de status via requisição tradicional ou links de ação rápida.
     */
    @GetMapping("/{id}/status/{novoStatus}")
    public String alterarStatusRapido(@PathVariable("id") Long id,
                                      @PathVariable("novoStatus") StatusServico novoStatus,
                                      HttpSession session,
                                      RedirectAttributes redirectAttributes) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            servicoService.atualizarStatus(id, novoStatus);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Status da OS #" + id + " atualizado para '" + novoStatus.getDescricao() + "'.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Erro ao atualizar status: " + e.getMessage());
        }

        return "redirect:/servicos";
    }

    /**
     * Endpoint REST/AJAX para alteração assíncrona de status via JavaScript com feedback imediato.
     */
    @PostMapping("/api/{id}/status")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> alterarStatusAjax(@PathVariable("id") Long id,
                                                                 @RequestParam("status") StatusServico status) {
        Map<String, Object> resposta = new HashMap<>();
        try {
            Servico servicoAtualizado = servicoService.atualizarStatus(id, status);
            resposta.put("sucesso", true);
            resposta.put("id", servicoAtualizado.getId());
            resposta.put("status", servicoAtualizado.getStatus().name());
            resposta.put("descricaoStatus", servicoAtualizado.getStatus().getDescricao());
            resposta.put("classeCss", servicoAtualizado.getStatus().getClasseCss());
            return ResponseEntity.ok(resposta);
        } catch (Exception e) {
            resposta.put("sucesso", false);
            resposta.put("mensagem", e.getMessage());
            return ResponseEntity.badRequest().body(resposta);
        }
    }

    /**
     * Exclui uma Ordem de Serviço.
     */
    @GetMapping("/excluir/{id}")
    public String excluirServico(@PathVariable("id") Long id,
                                 HttpSession session,
                                 RedirectAttributes redirectAttributes) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            servicoService.excluir(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Ordem de Serviço #" + id + " excluída com sucesso.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Erro ao excluir OS: " + e.getMessage());
        }

        return "redirect:/servicos";
    }
}
