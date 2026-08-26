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
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/** Contrato persistente de aluguel e respectiva vistoria de devolução. */
@Entity
@Table(name = "aluguel")
public class Aluguel {

    public enum StatusAluguel { EM_ANDAMENTO, DEVOLVIDO, ATRASADO }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "codigo_contrato", nullable = false, unique = true, length = 40)
    private String codigoContrato;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bicicleta_id", nullable = false)
    private BicicletaCatalogo bicicleta;
    @Column(name = "cliente_nome", nullable = false, length = 120)
    private String clienteNome;
    @Column(name = "cliente_cpf", nullable = false, length = 14)
    private String clienteCpf;
    @Column(name = "cliente_telefone", nullable = false, length = 20)
    private String clienteTelefone;
    @Column(name = "cliente_email", length = 100)
    private String clienteEmail;
    @Column(name = "cliente_endereco", length = 255)
    private String clienteEndereco;
    @Column(name = "data_retirada", nullable = false)
    private LocalDate dataRetirada;
    @Column(name = "hora_retirada", nullable = false)
    private LocalTime horaRetirada;
    @Column(name = "data_devolucao_prevista", nullable = false)
    private LocalDate dataDevolucaoPrevista;
    @Column(name = "hora_devolucao_prevista", nullable = false)
    private LocalTime horaDevolucaoPrevista;
    @Column(name = "data_devolucao_efetiva")
    private LocalDate dataDevolucaoEfetiva;
    @Column(name = "hora_devolucao_efetiva")
    private LocalTime horaDevolucaoEfetiva;
    @Column(name = "quantidade_diarias", nullable = false)
    private Integer quantidadeDiarias;
    @Column(name = "valor_diaria", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDiaria;
    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorTotal;
    @Column(name = "valor_caucao", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorCaucao;
    @Column(name = "valor_caucao_devolvido", precision = 10, scale = 2)
    private BigDecimal valorCaucaoDevolvido;
    @Column(name = "taxa_avaria_ou_atraso", precision = 10, scale = 2)
    private BigDecimal taxaAvariaOuAtraso;
    @Column(name = "motivo_taxa", length = 255)
    private String motivoTaxa;
    @Column(name = "metodo_devolucao_caucao", length = 50)
    private String metodoDevolucaoCaucao;
    @Column(name = "observacao_devolucao", columnDefinition = "TEXT")
    private String observacaoDevolucao;
    @Column(name = "forma_pagamento", nullable = false, length = 30)
    private String formaPagamento;
    @Column(name = "acessorios", columnDefinition = "TEXT")
    private String acessorios;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private StatusAluguel status = StatusAluguel.EM_ANDAMENTO;
    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCodigoContrato() { return codigoContrato; }
    public void setCodigoContrato(String codigoContrato) { this.codigoContrato = codigoContrato; }
    public BicicletaCatalogo getBicicleta() { return bicicleta; }
    public void setBicicleta(BicicletaCatalogo bicicleta) { this.bicicleta = bicicleta; }
    public String getClienteNome() { return clienteNome; }
    public void setClienteNome(String clienteNome) { this.clienteNome = clienteNome; }
    public String getClienteCpf() { return clienteCpf; }
    public void setClienteCpf(String clienteCpf) { this.clienteCpf = clienteCpf; }
    public String getClienteTelefone() { return clienteTelefone; }
    public void setClienteTelefone(String clienteTelefone) { this.clienteTelefone = clienteTelefone; }
    public String getClienteEmail() { return clienteEmail; }
    public void setClienteEmail(String clienteEmail) { this.clienteEmail = clienteEmail; }
    public String getClienteEndereco() { return clienteEndereco; }
    public void setClienteEndereco(String clienteEndereco) { this.clienteEndereco = clienteEndereco; }
    public LocalDate getDataRetirada() { return dataRetirada; }
    public void setDataRetirada(LocalDate dataRetirada) { this.dataRetirada = dataRetirada; }
    public LocalTime getHoraRetirada() { return horaRetirada; }
    public void setHoraRetirada(LocalTime horaRetirada) { this.horaRetirada = horaRetirada; }
    public LocalDate getDataDevolucaoPrevista() { return dataDevolucaoPrevista; }
    public void setDataDevolucaoPrevista(LocalDate dataDevolucaoPrevista) { this.dataDevolucaoPrevista = dataDevolucaoPrevista; }
    public LocalTime getHoraDevolucaoPrevista() { return horaDevolucaoPrevista; }
    public void setHoraDevolucaoPrevista(LocalTime horaDevolucaoPrevista) { this.horaDevolucaoPrevista = horaDevolucaoPrevista; }
    public LocalDate getDataDevolucaoEfetiva() { return dataDevolucaoEfetiva; }
    public void setDataDevolucaoEfetiva(LocalDate dataDevolucaoEfetiva) { this.dataDevolucaoEfetiva = dataDevolucaoEfetiva; }
    public LocalTime getHoraDevolucaoEfetiva() { return horaDevolucaoEfetiva; }
    public void setHoraDevolucaoEfetiva(LocalTime horaDevolucaoEfetiva) { this.horaDevolucaoEfetiva = horaDevolucaoEfetiva; }
    public Integer getQuantidadeDiarias() { return quantidadeDiarias; }
    public void setQuantidadeDiarias(Integer quantidadeDiarias) { this.quantidadeDiarias = quantidadeDiarias; }
    public BigDecimal getValorDiaria() { return valorDiaria; }
    public void setValorDiaria(BigDecimal valorDiaria) { this.valorDiaria = valorDiaria; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public void setValorTotal(BigDecimal valorTotal) { this.valorTotal = valorTotal; }
    public BigDecimal getValorCaucao() { return valorCaucao; }
    public void setValorCaucao(BigDecimal valorCaucao) { this.valorCaucao = valorCaucao; }
    public BigDecimal getValorCaucaoDevolvido() { return valorCaucaoDevolvido; }
    public void setValorCaucaoDevolvido(BigDecimal valorCaucaoDevolvido) { this.valorCaucaoDevolvido = valorCaucaoDevolvido; }
    public BigDecimal getTaxaAvariaOuAtraso() { return taxaAvariaOuAtraso; }
    public void setTaxaAvariaOuAtraso(BigDecimal taxaAvariaOuAtraso) { this.taxaAvariaOuAtraso = taxaAvariaOuAtraso; }
    public String getMotivoTaxa() { return motivoTaxa; }
    public void setMotivoTaxa(String motivoTaxa) { this.motivoTaxa = motivoTaxa; }
    public String getMetodoDevolucaoCaucao() { return metodoDevolucaoCaucao; }
    public void setMetodoDevolucaoCaucao(String metodoDevolucaoCaucao) { this.metodoDevolucaoCaucao = metodoDevolucaoCaucao; }
    public String getObservacaoDevolucao() { return observacaoDevolucao; }
    public void setObservacaoDevolucao(String observacaoDevolucao) { this.observacaoDevolucao = observacaoDevolucao; }
    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }
    public String getAcessorios() { return acessorios; }
    public void setAcessorios(String acessorios) { this.acessorios = acessorios; }
    public StatusAluguel getStatus() { return status; }
    public void setStatus(StatusAluguel status) { this.status = status; }
    public LocalDate getDataCriacao() { return dataCriacao; }
    public void setDataCriacao(LocalDate dataCriacao) { this.dataCriacao = dataCriacao; }
}
