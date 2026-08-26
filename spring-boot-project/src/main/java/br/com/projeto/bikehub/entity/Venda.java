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
import java.math.BigDecimal;
import java.time.LocalDate;

/** Registro persistente de uma venda concluída no catálogo BikeHub. */
@Entity
@Table(name = "venda")
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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
    @Column(name = "valor_original", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorOriginal;
    @Column(name = "desconto", nullable = false, precision = 10, scale = 2)
    private BigDecimal desconto;
    @Column(name = "valor_final", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorFinal;
    @Column(name = "forma_pagamento", nullable = false, length = 30)
    private String formaPagamento;
    private Integer parcelas;
    @Column(name = "data_venda", nullable = false)
    private LocalDate dataVenda;
    @Column(name = "garantia_meses", nullable = false)
    private Integer garantiaMeses;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public BigDecimal getValorOriginal() { return valorOriginal; }
    public void setValorOriginal(BigDecimal valorOriginal) { this.valorOriginal = valorOriginal; }
    public BigDecimal getDesconto() { return desconto; }
    public void setDesconto(BigDecimal desconto) { this.desconto = desconto; }
    public BigDecimal getValorFinal() { return valorFinal; }
    public void setValorFinal(BigDecimal valorFinal) { this.valorFinal = valorFinal; }
    public String getFormaPagamento() { return formaPagamento; }
    public void setFormaPagamento(String formaPagamento) { this.formaPagamento = formaPagamento; }
    public Integer getParcelas() { return parcelas; }
    public void setParcelas(Integer parcelas) { this.parcelas = parcelas; }
    public LocalDate getDataVenda() { return dataVenda; }
    public void setDataVenda(LocalDate dataVenda) { this.dataVenda = dataVenda; }
    public Integer getGarantiaMeses() { return garantiaMeses; }
    public void setGarantiaMeses(Integer garantiaMeses) { this.garantiaMeses = garantiaMeses; }
}
