package br.com.projeto.bikehub.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * ======================================================================
 * ENTIDADE: CLIENTE (br.com.projeto.bikehub.entity.Cliente)
 * ======================================================================
 * Representa os clientes cadastrados na loja BikeHub, que podem ser
 * donos de bicicletas em manutenção, compradores ou locatários.
 *
 * Mapeamento JPA:
 * - @Entity: Entidade JPA vinculada à tabela 'cliente'.
 * - @OneToMany: Relacionamento 1-para-Muitos com as bicicletas do cliente.
 * - @NotBlank / @Email: Anotações do Bean Validation para integridade de dados.
 */
@Entity
@Table(name = "cliente")
public class Cliente implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Chave Primária do cliente com auto-incremento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome completo do cliente. Campo obrigatório.
     */
    @NotBlank(message = "O nome do cliente é obrigatório.")
    @Size(min = 3, max = 120, message = "O nome deve ter entre 3 e 120 caracteres.")
    @Column(name = "nome", nullable = false, length = 120)
    private String nome;

    /**
     * Telefone de contato no formato brasileiro: (XX) XXXXX-XXXX.
     */
    @NotBlank(message = "O telefone de contato é obrigatório.")
    @Column(name = "telefone", nullable = false, length = 20)
    private String telefone;

    /**
     * Endereço eletrônico de e-mail do cliente, com validação de formato.
     */
    @NotBlank(message = "O e-mail é obrigatório.")
    @Email(message = "Informe um endereço de e-mail válido (exemplo: cliente@email.com).")
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    /**
     * CPF do cliente para fins de nota de serviço e contrato de locação.
     */
    @Column(name = "cpf", length = 14)
    private String cpf;

    /**
     * Lista de bicicletas de propriedade deste cliente cadastradas na oficina.
     * cascade = CascadeType.ALL: Ao salvar o cliente, suas bicicletas também são salvas/atualizadas.
     * orphanRemoval = true: Se uma bicicleta for removida da lista, ela é excluída do banco.
     */
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Bicicleta> bicicletas = new ArrayList<>();

    /**
     * Data e hora do cadastro do cliente.
     */
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    /**
     * Construtor padrão JPA.
     */
    public Cliente() {
    }

    /**
     * Construtor com dados principais para inicialização rápida.
     */
    public Cliente(String nome, String telefone, String email, String cpf) {
        this.nome = nome;
        this.telefone = telefone;
        this.email = email;
        this.cpf = cpf;
        this.criadoEm = LocalDateTime.now();
    }

    /**
     * Método auxiliar (Helper Method) para adicionar uma bicicleta e manter a coerência bidirecional.
     *
     * @param bicicleta Objeto de bicicleta a ser associado
     */
    public void adicionarBicicleta(Bicicleta bicicleta) {
        bicicletas.add(bicicleta);
        bicicleta.setCliente(this);
    }

    /**
     * Método auxiliar para desvincular uma bicicleta.
     *
     * @param bicicleta Objeto a ser desvinculado
     */
    public void removerBicicleta(Bicicleta bicicleta) {
        bicicletas.remove(bicicleta);
        bicicleta.setCliente(null);
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

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCpf() {
        return cpf;
    }

    public void setCpf(String cpf) {
        this.cpf = cpf;
    }

    public List<Bicicleta> getBicicletas() {
        return bicicletas;
    }

    public void setBicicletas(List<Bicicleta> bicicletas) {
        this.bicicletas = bicicletas;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
