package br.com.projeto.bikehub.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ======================================================================
 * ENTIDADE: ORDEM DE SERVIÇO / MANUTENÇÃO (br.com.projeto.bikehub.entity.Servico)
 * ======================================================================
 * Representa uma Ordem de Serviço (OS) para conserto, manutenção preventiva,
 * revisão geral ou instalação de componentes na bicicleta de um cliente.
 *
 * Mapeamento JPA:
 * - @Entity: Mapeada para a tabela 'servico'.
 * - @ManyToOne: Relacionamento com Cliente e Bicicleta.
 * - @Enumerated(EnumType.STRING): Salva o status como texto no banco para clareza.
 */
@Entity
@Table(name = "servico")
public class Servico implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * ==================================================================
     * ENUM: STATUS DO SERVIÇO NA OFICINA
     * ==================================================================
     * Representa as etapas do fluxo de trabalho da oficina mecânica:
     * - PENDENTE: OS criada, aguardando início da avaliação técnica.
     * - EM_ANALISE: Mecânico inspecionando a bicicleta para diagnóstico.
     * - EM_MANUTENCAO: Reparos e trocas de peças sendo executados.
     * - PRONTO_PARA_RETIRADA: Serviço concluído, aguardando retirada pelo cliente.
     * - ENTREGUE: Bicicleta entregue e pagamento finalizado.
     */
    public enum StatusServico {
        PENDENTE("Pendente", "badge-pendente", "Aguardando Início"),
        EM_ANALISE("Em Análise", "badge-analise", "Diagnóstico Técnico"),
        EM_MANUTENCAO("Em Manutenção", "badge-manutencao", "Executando Reparo"),
        PRONTO_PARA_RETIRADA("Pronto para Retirada", "badge-pronto", "Aguardando Cliente"),
        ENTREGUE("Entregue", "badge-entregue", "Finalizado");

        private final String descricao;
        private final String classeCss;
        private final String subtitulo;

        StatusServico(String descricao, String classeCss, String subtitulo) {
            this.descricao = descricao;
            this.classeCss = classeCss;
            this.subtitulo = subtitulo;
        }

        public String getDescricao() {
            return descricao;
        }

        public String getClasseCss() {
            return classeCss;
        }

        public String getSubtitulo() {
            return subtitulo;
        }
    }

    /**
     * Chave Primária da Ordem de Serviço (Número da OS).
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Chave Estrangeira: Cliente solicitante da manutenção.
     */
    @NotNull(message = "O cliente solicitante é obrigatório.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    /**
     * Chave Estrangeira: Bicicleta do cliente a ser reparada.
     */
    @NotNull(message = "A bicicleta a ser reparada é obrigatória.")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bicicleta_id", nullable = false)
    private Bicicleta bicicleta;

    /**
     * Descrição detalhada dos serviços a serem realizados, peças e observações.
     */
    @NotBlank(message = "A descrição do serviço e peças é obrigatória.")
    @Column(name = "descricao", nullable = false, columnDefinition = "TEXT")
    private String descricao;

    /**
     * Valor monetário total do serviço (mão de obra + peças) em Reais (R$).
     */
    @NotNull(message = "O valor do serviço é obrigatório.")
    @DecimalMin(value = "0.01", message = "O valor deve ser maior que zero.")
    @Column(name = "valor", nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    /**
     * Data e hora de abertura da Ordem de Serviço.
     */
    @Column(name = "data_abertura", updatable = false)
    private LocalDateTime dataAbertura = LocalDateTime.now();

    /**
     * Data prometida para entrega da bicicleta pronta ao cliente.
     */
    @NotNull(message = "A data prevista de entrega é obrigatória.")
    @Column(name = "data_entrega", nullable = false)
    private LocalDate dataEntrega;

    /**
     * Status atual no fluxo de execução da oficina.
     */
    @NotNull(message = "O status do serviço é obrigatório.")
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 30)
    private StatusServico status = StatusServico.PENDENTE;

    /**
     * Construtor padrão JPA.
     */
    public Servico() {
    }

    /**
     * Construtor completo para cadastro de nova OS.
     */
    public Servico(Cliente cliente, Bicicleta bicicleta, String descricao, BigDecimal valor, LocalDate dataEntrega, StatusServico status) {
        this.cliente = cliente;
        this.bicicleta = bicicleta;
        this.descricao = descricao;
        this.valor = valor;
        this.dataAbertura = LocalDateTime.now();
        this.dataEntrega = dataEntrega;
        this.status = (status != null) ? status : StatusServico.PENDENTE;
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

    public Bicicleta getBicicleta() {
        return bicicleta;
    }

    public void setBicicleta(Bicicleta bicicleta) {
        this.bicicleta = bicicleta;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getValor() {
        return valor;
    }

    public void setValor(BigDecimal valor) {
        this.valor = valor;
    }

    public LocalDateTime getDataAbertura() {
        return dataAbertura;
    }

    public void setDataAbertura(LocalDateTime dataAbertura) {
        this.dataAbertura = dataAbertura;
    }

    public LocalDate getDataEntrega() {
        return dataEntrega;
    }

    public void setDataEntrega(LocalDate dataEntrega) {
        this.dataEntrega = dataEntrega;
    }

    public StatusServico getStatus() {
        return status;
    }

    public void setStatus(StatusServico status) {
        this.status = status;
    }
}
