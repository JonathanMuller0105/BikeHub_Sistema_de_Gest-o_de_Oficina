package br.com.projeto.bikehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ======================================================================
 * ENTIDADE: CATÁLOGO DE BICICLETAS (br.com.projeto.bikehub.entity.BicicletaCatalogo)
 * ======================================================================
 * Representa o estoque de bicicletas disponíveis para:
 * 1. VENDA: Bicicletas semi-novas revisadas pela oficina.
 * 2. ALUGUEL: Frota de bicicletas para locação por diária.
 *
 * Mapeamento JPA:
 * - @Entity: Mapeada para a tabela 'bicicleta_catalogo'.
 * - @Enumerated(EnumType.STRING): Mapeia os Enums de Faixa Etária e Tipo de Operação como strings legíveis.
 */
@Entity
@Table(name = "bicicleta_catalogo")
public class BicicletaCatalogo implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * ==================================================================
     * ENUM: FAIXA ETÁRIA DO CATÁLOGO
     * ==================================================================
     */
    public enum FaixaEtaria {
        INFANTIL("Infantil (Aros 12 a 20)", "badge-infantil"),
        JUVENIL("Juvenil (Aros 24)", "badge-juvenil"),
        ADULTO("Adulto (Aros 26 a 29 e Road)", "badge-adulto");

        private final String descricao;
        private final String classeBadge;

        FaixaEtaria(String descricao, String classeBadge) {
            this.descricao = descricao;
            this.classeBadge = classeBadge;
        }

        public String getDescricao() {
            return descricao;
        }

        public String getClasseBadge() {
            return classeBadge;
        }
    }

    /**
     * ==================================================================
     * ENUM: TIPO DE OPERAÇÃO COMERCIAL
     * ==================================================================
     */
    public enum TipoOperacao {
        VENDA("Venda de Semi-Nova", "R$ Valor Total"),
        ALUGUEL("Locação por Diária", "R$ / diária");

        private final String rotulo;
        private final String unidadePreco;

        TipoOperacao(String rotulo, String unidadePreco) {
            this.rotulo = rotulo;
            this.unidadePreco = unidadePreco;
        }

        public String getRotulo() {
            return rotulo;
        }

        public String getUnidadePreco() {
            return unidadePreco;
        }
    }

    /**
     * Chave Primária do item no catálogo.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Marca do fabricante (ex: Scott, Trek, Caloi, Specialized, Oggi).
     */
    @NotBlank(message = "A marca da bicicleta é obrigatória.")
    @Column(name = "marca", nullable = false, length = 50)
    private String marca;

    /**
     * Modelo da bicicleta (ex: Aspect 950, Marlin 7, Hot Wheels).
     */
    @NotBlank(message = "O modelo é obrigatório.")
    @Column(name = "modelo", nullable = false, length = 80)
    private String modelo;

    /**
     * Cor do acabamento.
     */
    @NotBlank(message = "A cor é obrigatória.")
    @Column(name = "cor", nullable = false, length = 30)
    private String cor;

    /**
     * Ano de fabricação do modelo.
     */
    @NotNull(message = "O ano é obrigatório.")
    @Min(value = 1990, message = "Ano de fabricação deve ser válido.")
    @Column(name = "ano", nullable = false)
    private Integer ano;

    /**
     * Segmentação de público: INFANTIL, JUVENIL ou ADULTO.
     */
    @NotNull(message = "A faixa etária é obrigatória.")
    @Enumerated(EnumType.STRING)
    @Column(name = "faixa_etaria", nullable = false, length = 20)
    private FaixaEtaria faixaEtaria;

    /**
     * Destinação: VENDA ou ALUGUEL.
     */
    @NotNull(message = "O tipo de operação é obrigatório.")
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_operacao", nullable = false, length = 20)
    private TipoOperacao tipoOperacao;

    /**
     * Valor em Reais (R$).
     * - Se VENDA: Preço total de aquisição.
     * - Se ALUGUEL: Valor da diária de locação.
     */
    @NotNull(message = "O valor é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser positivo.")
    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    /**
     * Indicador de disponibilidade para venda ou locação no momento.
     */
    @Column(name = "disponivel", nullable = false)
    private Boolean disponivel = true;

    /**
     * URL da imagem de exibição no card do catálogo.
     */
    @Column(name = "imagem_url", length = 255)
    private String imagemUrl;

    /**
     * Descrição comercial das especificações técnicas e estado de conservação.
     */
    @Column(name = "descricao", length = 255)
    private String descricao;

    /**
     * Data de cadastro no catálogo.
     */
    @Column(name = "criado_em", updatable = false)
    private LocalDateTime criadoEm = LocalDateTime.now();

    /**
     * Construtor padrão JPA.
     */
    public BicicletaCatalogo() {
    }

    /**
     * Construtor completo para povoamento e novos cadastros.
     */
    public BicicletaCatalogo(String marca, String modelo, String cor, Integer ano,
                             FaixaEtaria faixaEtaria, TipoOperacao tipoOperacao,
                             BigDecimal valor, Boolean disponivel, String imagemUrl, String descricao) {
        this.marca = marca;
        this.modelo = modelo;
        this.cor = cor;
        this.ano = ano;
        this.faixaEtaria = faixaEtaria;
        this.tipoOperacao = tipoOperacao;
        this.valor = valor;
        this.disponivel = (disponivel != null) ? disponivel : true;
        this.imagemUrl = imagemUrl;
        this.descricao = descricao;
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

    public FaixaEtaria getFaixaEtaria() {
        return faixaEtaria;
    }

    public void setFaixaEtaria(FaixaEtaria faixaEtaria) {
        this.faixaEtaria = faixaEtaria;
    }

    public TipoOperacao getTipoOperacao() {
        return tipoOperacao;
    }

    public void setTipoOperacao(TipoOperacao tipoOperacao) {
        this.tipoOperacao = tipoOperacao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public Boolean getDisponivel() {
        return disponivel;
    }

    public void setDisponivel(Boolean disponivel) {
        this.disponivel = disponivel;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public void setCriadoEm(LocalDateTime criadoEm) {
        this.criadoEm = criadoEm;
    }
}
