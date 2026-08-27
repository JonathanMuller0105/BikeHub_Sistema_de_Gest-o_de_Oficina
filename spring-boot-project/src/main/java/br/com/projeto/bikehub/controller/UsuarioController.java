package br.com.projeto.bikehub.controller;

import br.com.projeto.bikehub.entity.Usuario;
import br.com.projeto.bikehub.service.UsuarioService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller @RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService service;
    public UsuarioController(UsuarioService service) { this.service = service; }
    @GetMapping public String listar(HttpSession s, Model m) { if(!service.isUsuarioLogado(s)) return "redirect:/login"; m.addAttribute("usuarios", service.listarTodos()); return "usuarios/lista"; }
    @GetMapping("/novo") public String novo(HttpSession s, Model m) { if(!service.isUsuarioLogado(s)) return "redirect:/login"; m.addAttribute("usuario", new Usuario()); return "usuarios/formulario"; }
    @GetMapping("/{id}/editar") public String editar(@PathVariable Long id,HttpSession s,Model m){if(!service.isUsuarioLogado(s))return "redirect:/login";m.addAttribute("usuario",service.buscarPorId(id).orElseThrow());return "usuarios/formulario";}
    @PostMapping("/salvar") public String salvar(@ModelAttribute Usuario usuario,HttpSession s,RedirectAttributes r){if(!service.isUsuarioLogado(s))return "redirect:/login";try{service.salvar(usuario);r.addFlashAttribute("mensagemSucesso","Usuário salvo.");}catch(Exception e){r.addFlashAttribute("mensagemErro",e.getMessage());}return "redirect:/usuarios";}
    @GetMapping("/{id}/excluir") public String excluir(@PathVariable Long id,HttpSession s,RedirectAttributes r){if(!service.isUsuarioLogado(s))return "redirect:/login";service.excluir(id);r.addFlashAttribute("mensagemSucesso","Usuário excluído.");return "redirect:/usuarios";}
}
