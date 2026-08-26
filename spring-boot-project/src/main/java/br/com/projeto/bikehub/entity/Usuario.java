package br.com.projeto.bikehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * ======================================================================
 * ENTIDADE: USUÁRIO DO SISTEMA (br.com.projeto.bikehub.entity.Usuario)
 * ======================================================================
 * Representa os usuários autenticáveis no sistema BikeHub (Administradores,
 * Atendentes e Mecânicos da oficina).
 *
 * Mapeamento JPA:
 * - @Entity: Define que a classe Java é mapeada para uma tabela relacional.
 * - @Table: Especifica o nome da tabela 'usuario' no banco de dados MySQL.
 */
@Entity
@Table(name = "usuario")
public class Usuario implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Identificador único (Chave Primária) gerado automaticamente pelo banco MySQL (AUTO_INCREMENT).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome de usuário único para realização do login no sistema.
     * Exemplo: Admin1234
     */
    @NotBlank(message = "O nome de usuário é obrigatório.")
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    /**
     * Senha de acesso do usuário.
     * Exemplo: Admin123456
     */
    @NotBlank(message = "A senha de acesso é obrigatória.")
    @Column(name = "senha", nullable = false, length = 100)
    private String senha;

    /**
     * Nome completo do operador para exibição no cabeçalho do painel.
     */
    @Column(name = "nome_completo", length = 100)
    private String nomeCompleto;

    /** Dados profissionais opcionais exibidos na gestão de funcionários do React. */
    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "telefone", length = 20)
    private String telefone;

    @Column(name = "cargo", length = 80)
    private String cargo;

    /**
     * Perfil de permissão (ex: ADMIN, ATENDENTE, MECANICO).
     */
    @Column(name = "perfil", length = 20)
    private String perfil = "ADMIN";

    /**
     * Flag indicando se a conta está ativa ou inativa.
     */
    @Column(name = "ativo")
    private Boolean ativo = true;

    /**
     * Data e hora de criação do registro no sistema.
     */
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    /**
     * Construtor padrão exigido pela especificação JPA.
     */
    public Usuario() {
    }

    /**
     * Construtor com parâmetros para criação rápida de novos usuários.
     *
     * @param username Nome de login
     * @param senha Senha de acesso
     * @param nomeCompleto Nome completo do usuário
     */
    public Usuario(String username, String senha, String nomeCompleto) {
        this.username = username;
        this.senha = senha;
        this.nomeCompleto = nomeCompleto;
        this.perfil = "ADMIN";
        this.ativo = true;
        this.criadoEm = LocalDateTime.now();
    }

    // ==================================================================
    // MÉTODOS GETTERS E SETTERS
    // ==================================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }

    public String getNomeCompleto() {
        return nomeCompleto;
    }

    public void setNomeCompleto(String nomeCompleto) {
        this.nomeCompleto = nomeCompleto;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getPerfil() {
        return perfil;
    }

    public void setPerfil(String perfil) {
        this.perfil = perfil;
    }

    public Boolean getAtivo() {
        return ativo;
    }

    public void setAtivo(Boolean ativo) {
        this.ativo = ativo;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
