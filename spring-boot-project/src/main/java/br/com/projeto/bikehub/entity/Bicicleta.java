package br.com.projeto.bikehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * ======================================================================
 * ENTIDADE: BICICLETA DO CLIENTE (br.com.projeto.bikehub.entity.Bicicleta)
 * ======================================================================
 * Representa a bicicleta particular de um cliente, utilizada para
 * abertura de Ordens de Serviço (OS) e histórico de manutenções mecânicas.
 *
 * Mapeamento JPA:
 * - @Entity: Vinculada à tabela 'bicicleta'.
 * - @ManyToOne: Muitas bicicletas podem pertencer a um único Cliente.
 * - @JoinColumn: Especifica a coluna 'cliente_id' como Chave Estrangeira (FK).
 */
@Entity
@Table(name = "bicicleta")
public class Bicicleta implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Chave Primária da bicicleta do cliente.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Relacionamento Muitos-para-Um com a entidade Cliente proprietário.
     * FetchType.LAZY: Carrega os dados do cliente apenas sob demanda para otimizar memória.
     */
    @NotNull(message = "O cliente proprietário é obrigatório.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    /**
     * Marca fabricante da bicicleta (ex: Caloi, Specialized, Trek, Sense).
     */
    @NotBlank(message = "A marca da bicicleta é obrigatória.")
    @Column(name = "marca", nullable = false, length = 50)
    private String marca;

    /**
     * Modelo da bicicleta (ex: Explorer Pro 29, Rockhopper, Marlin 7).
     */
    @NotBlank(message = "O modelo da bicicleta é obrigatório.")
    @Column(name = "modelo", nullable = false, length = 80)
    private String modelo;

    /**
     * Cor predominante da bicicleta.
     */
    @NotBlank(message = "A cor da bicicleta é obrigatória.")
    @Column(name = "cor", nullable = false, length = 30)
    private String cor;

    /**
     * Ano de fabricação do modelo/quadro.
     */
    @NotNull(message = "O ano de fabricação é obrigatório.")
    @Min(value = 1970, message = "O ano de fabricação deve ser válido (a partir de 1970).")
    @Column(name = "ano", nullable = false)
    private Integer ano;

    /**
     * Número de série ou chassi gravado no quadro da bicicleta.
     */
    @Column(name = "numero_serie", length = 50)
    private String numeroSerie;

    /**
     * Data de cadastro da bicicleta no sistema.
     */
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    /**
     * Construtor padrão JPA.
     */
    public Bicicleta() {
    }

    /**
     * Construtor completo para cadastro rápido.
     */
    public Bicicleta(Cliente cliente, String marca, String modelo, String cor, Integer ano, String numeroSerie) {
        this.cliente = cliente;
        this.marca = marca;
        this.modelo = modelo;
        this.cor = cor;
        this.ano = ano;
        this.numeroSerie = numeroSerie;
        this.criadoEm = LocalDateTime.now();
    }

    /**
     * Retorna a descrição formatada da bicicleta para fácil exibição em selects e tabelas.
     * Exemplo: "Caloi Explorer Pro 29 - Azul Metálico (2022)"
     */
    public String getDescricaoCompleta() {
        return this.marca + " " + this.modelo + " (" + this.cor + " - " + this.ano + ")";
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

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getModelo() {
        return modelo;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public String getCor() {
        return cor;
    }

    public void setCor(String cor) {
        this.cor = cor;
    }

    public Integer getAno() {
        return ano;
    }

    public void setAno(Integer ano) {
        this.ano = ano;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
