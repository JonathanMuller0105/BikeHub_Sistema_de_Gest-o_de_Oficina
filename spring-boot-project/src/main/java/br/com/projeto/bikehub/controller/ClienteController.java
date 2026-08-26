package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.Cliente;
import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.service.ClienteService;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.util.List;

/**
 * ======================================================================
 * CONTROLADOR: GESTÃO DE CLIENTES (br.com.projeto.bikehub.controller.ClienteController)
 * ======================================================================
 * Gerencia as operações de cadastro unificado (Cliente + Bicicleta), listagem,
 * pesquisa e exclusão de clientes da oficina BikeHub.
 */
@Controller
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;
    private final UsuarioService usuarioService;

    @Autowired
    public ClienteController(ClienteService clienteService, UsuarioService usuarioService) {
        this.clienteService = clienteService;
        this.usuarioService = usuarioService;
    }

    /**
     * Exibe a listagem de todos os clientes cadastrados com suporte a busca textual.
     */
    @GetMapping
    public String listarClientes(@RequestParam(value = "termo", required = false) String termo,
                                 HttpSession session,
                                 Model model) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        List<Cliente> clientes = clienteService.pesquisar(termo);
        model.addAttribute("clientes", clientes);
        model.addAttribute("termoPesquisado", termo);
        model.addAttribute("paginaAtiva", "clientes");

        return "clientes/lista";
    }

    /**
     * Exibe o formulário de cadastro unificado contendo duas seções integradas:
     * Seção 1: Dados Pessoais do Cliente (Nome, Telefone, E-mail, CPF)
     * Seção 2: Dados Técnicos da Bicicleta (Marca, Modelo, Cor, Ano, Número de Série)
     */
    @GetMapping("/novo")
    public String exibirFormularioCadastro(HttpSession session, Model model) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        // Objeto Cliente limpo para binding com o th:object do Thymeleaf
        model.addAttribute("cliente", new Cliente());
        model.addAttribute("paginaAtiva", "clientes");

        return "clientes/formulario";
    }

    /**
     * Processa o salvamento do cadastro unificado com validação Bean Validation (@Valid).
     *
     * @param cliente Objeto Cliente com os dados validados
     * @param result Resultado das validações de anotação (@NotBlank, @Email)
     * @param marcaBicicleta Marca da bicicleta informada na seção 2
     * @param modeloBicicleta Modelo da bicicleta informado na seção 2
     * @param corBicicleta Cor da bicicleta
     * @param anoBicicleta Ano de fabricação
     * @param numeroSerie Número de série
     * @param redirectAttributes Mensagens de retorno flash
     */
    @PostMapping("/salvar")
    public String salvarClienteIntegrado(@Valid @ModelAttribute("cliente") Cliente cliente,
                                         BindingResult result,
                                         @RequestParam(value = "marcaBicicleta", required = false) String marcaBicicleta,
                                         @RequestParam(value = "modeloBicicleta", required = false) String modeloBicicleta,
                                         @RequestParam(value = "corBicicleta", required = false) String corBicicleta,
                                         @RequestParam(value = "anoBicicleta", required = false) Integer anoBicicleta,
                                         @RequestParam(value = "numeroSerie", required = false) String numeroSerie,
                                         HttpSession session,
                                         Model model,
                                         RedirectAttributes redirectAttributes) {

        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        // Se houver erro de validação nos campos do Cliente, retorna ao formulário com as mensagens
        if (result.hasErrors()) {
            model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
            model.addAttribute("paginaAtiva", "clientes");
            model.addAttribute("mensagemErro", "Por favor, corrija os erros apontados no formulário.");
            return "clientes/formulario";
        }

        try {
            // Executa o cadastro integrado no serviço
            clienteService.salvarCadastroIntegrado(
                    cliente,
                    marcaBicicleta,
                    modeloBicicleta,
                    corBicicleta,
                    anoBicicleta,
                    numeroSerie
            );

            redirectAttributes.addFlashAttribute("mensagemSucesso", "Cliente e bicicleta cadastrados com sucesso!");
            return "redirect:/clientes";
        } catch (Exception e) {
            model.addAttribute("usuarioLogado", usuarioService.getUsuarioLogado(session));
            model.addAttribute("mensagemErro", "Erro ao salvar cliente: " + e.getMessage());
            return "clientes/formulario";
        }
    }

    /**
     * Exclui um cliente pelo identificador.
     */
    @GetMapping("/excluir/{id}")
    public String excluirCliente(@PathVariable("id") Long id,
                                 HttpSession session,
                                 RedirectAttributes redirectAttributes) {
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        try {
            clienteService.excluirCliente(id);
            redirectAttributes.addFlashAttribute("mensagemSucesso", "Cliente removido com sucesso!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("mensagemErro", "Não foi possível excluir o cliente pois existem ordens de serviço vinculadas.");
        }

        return "redirect:/clientes";
    }
}
