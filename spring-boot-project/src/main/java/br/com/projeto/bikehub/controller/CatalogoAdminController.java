package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.BicicletaCatalogo;
import br.com.projeto.bikehub.service.CatalogoService;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller @RequestMapping("/catalogo/admin")
public class CatalogoAdminController {
    private final CatalogoService service; private final UsuarioService usuarios;
    public CatalogoAdminController(CatalogoService service,UsuarioService usuarios){this.service=service;this.usuarios=usuarios;}
    @GetMapping public String listar(HttpSession s,Model m){if(!usuarios.isUsuarioLogado(s))return "redirect:/login";m.addAttribute("itens",service.listarTodos());return "catalogo/lista";}
    @GetMapping("/novo") public String novo(HttpSession s,Model m){if(!usuarios.isUsuarioLogado(s))return "redirect:/login";m.addAttribute("item",new BicicletaCatalogo());return "catalogo/formulario";}
    @GetMapping("/{id}/editar") public String editar(@PathVariable Long id,HttpSession s,Model m){if(!usuarios.isUsuarioLogado(s))return "redirect:/login";m.addAttribute("item",service.buscarPorId(id).orElseThrow());return "catalogo/formulario";}
    @PostMapping("/salvar") public String salvar(@ModelAttribute BicicletaCatalogo item,HttpSession s,RedirectAttributes r){if(!usuarios.isUsuarioLogado(s))return "redirect:/login";if(item.getId()==null)service.salvar(item);else service.atualizar(item.getId(),item.getMarca(),item.getModelo(),item.getCor(),item.getAno(),item.getFaixaEtaria(),item.getTipoOperacao(),item.getValor(),item.getDisponivel(),item.getImagemUrl(),item.getDescricao());r.addFlashAttribute("mensagemSucesso","Item salvo.");return "redirect:/catalogo/admin";}
    @GetMapping("/{id}/excluir") public String excluir(@PathVariable Long id,HttpSession s,RedirectAttributes r){if(!usuarios.isUsuarioLogado(s))return "redirect:/login";try{service.excluir(id);r.addFlashAttribute("mensagemSucesso","Item excluído.");}catch(Exception e){r.addFlashAttribute("mensagemErro",e.getMessage());}return "redirect:/catalogo/admin";}
}
