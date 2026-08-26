package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.service.CatalogoService;
import br.com.projeto.bikehub.service.ClienteService;
import br.com.projeto.bikehub.service.ServicoService;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.Map;

/**
 * ======================================================================
 * CONTROLADOR: PAINEL PRINCIPAL / DASHBOARD (br.com.projeto.bikehub.controller.DashboardController)
 * ======================================================================
 * Responsável por agregar as métricas de performance da oficina mecânica,
 * estoque de vendas e frota de locação, exibindo o painel central do BikeHub.
 */
@Controller
public class DashboardController {

    private final UsuarioService usuarioService;
    private final ServicoService servicoService;
    private final CatalogoService catalogoService;
    private final ClienteService clienteService;

    @Autowired
    public DashboardController(UsuarioService usuarioService,
                               ServicoService servicoService,
                               CatalogoService catalogoService,
                               ClienteService clienteService) {
        this.usuarioService = usuarioService;
        this.servicoService = servicoService;
        this.catalogoService = catalogoService;
        this.clienteService = clienteService;
    }

    /**
     * Exibe o Painel de Controle com métricas em tempo real:
     * - Total de Ordens de Serviço por status (Pendentes, Em Análise, Em Manutenção, Pronto para Retirada, Entregues)
     * - Faturamento financeiro acumulado
     * - Locações ativas vs. disponíveis
     * - Estoque de semi-novas disponíveis
     * - Total de clientes cadastrados
     * - Lista das últimas atividades na oficina
     *
     * @param session Sessão HTTP para proteção de acesso
     * @param model Objeto para envio de dados ao template Thymeleaf
     * @return Template 'dashboard' ou redirecionamento para /login se não autenticado
     */
    @GetMapping("/dashboard")
    public String exibirDashboard(HttpSession session, Model model) {
        // Proteção de Rota: Redireciona para login se não houver usuário autenticado
        if (!usuarioService.isUsuarioLogado(session)) {
            return "redirect:/login";
        }

        // Obtém o usuário logado para exibir no menu/navbar
        Usuario usuarioLogado = usuarioService.getUsuarioLogado(session);
        model.addAttribute("usuarioLogado", usuarioLogado);

        // Agrega métricas das Ordens de Serviço (Oficina)
        Map<String, Object> metricasOficina = servicoService.obterMetricasOficina();
        model.addAttribute("metricasOficina", metricasOficina);

        // Agrega métricas do Catálogo Comercial (Vendas e Aluguel)
        Map<String, Object> metricasComerciais = catalogoService.obterMetricasComerciais();
        model.addAttribute("metricasComerciais", metricasComerciais);

        // Quantidade total de clientes registrados
        long totalClientes = clienteService.contarTotalClientes();
        model.addAttribute("totalClientes", totalClientes);

        // Lista das 5 ordens de serviço mais recentes
        model.addAttribute("atividadesRecentes", servicoService.listarAtividadesRecentes());

        // Identificador da página ativa para destaque no menu lateral
        model.addAttribute("paginaAtiva", "dashboard");

        return "dashboard";
    }
}
