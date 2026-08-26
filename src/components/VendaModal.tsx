/**
 * ======================================================================
 * COMPONENTE: MODAL DE REGISTRO DE VENDA & PAGAMENTOS (PIX E CARTÕES)
 * Localização: src/components/VendaModal.tsx
 * ======================================================================
 * Recursos:
 * - Identificação do comprador com busca por Nome ou CPF e auto-preenchimento
 * - Pagamento PIX com QR Code dinâmico, Chave PIX e código Copia e Cola
 * - Pagamento por Cartão de Crédito (com simulador de parcelas até 12x) e Débito
 * - Pagamento em Dinheiro com cálculo de troco
 * - Emissão de Recibo de Venda com Termo de Garantia Mecânica de 6 Meses e Impressão
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Check, 
  X, 
  CreditCard, 
  QrCode, 
  DollarSign, 
  ShieldCheck, 
  Copy, 
  Printer, 
  Sparkles, 
  FileText, 
  Bike,
  User,
  CheckCircle2
} from 'lucide-react';
import { BicicletaCatalogo, Cliente, FormaPagamento, VendaRegistro } from '../types';

interface VendaModalProps {
  bike: BicicletaCatalogo;
  clientesCadastrados?: Cliente[];
  onFechar: () => void;
  onConfirmarVenda: (dadosVenda: Omit<VendaRegistro, 'id'>) => void;
}

export const VendaModal: React.FC<VendaModalProps> = ({
  bike,
  clientesCadastrados = [],
  onFechar,
  onConfirmarVenda,
}) => {
  const [etapa, setEtapa] = useState<'pagamento' | 'recibo'>('pagamento');

  // Busca do Comprador
  const [buscaCliente, setBuscaCliente] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);

  // Dados do Comprador
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');

  // Financeiro & Pagamento
  const [desconto, setDesconto] = useState<number>(0);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');
  const [parcelas, setParcelas] = useState<number>(1);
  const [chaveCopiada, setChaveCopiada] = useState(false);
  const [copiaColaCopiado, setCopiaColaCopiado] = useState(false);

  // Dados do Cartão
  const [bandeiraCartao, setBandeiraCartao] = useState('Mastercard');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [nomeCartao, setNomeCartao] = useState('');
  const [validadeCartao, setValidadeCartao] = useState('');
  const [cvvCartao, setCvvCartao] = useState('');

  // Dinheiro
  const [valorRecebido, setValorRecebido] = useState<number>(bike.valor);

  const [erro, setErro] = useState('');

  const valorFinal = Math.max(0, bike.valor - (desconto || 0));
  const chavePixOficial = 'financeiro@bikehub.com.br';
  const codigoPixCopiaCola = `00020126580014br.gov.bcb.pix0136${chavePixOficial}520400005303986540${valorFinal.toFixed(2)}5802BR5916BIKEHUB OFICINA6009SAO PAULO62070503***6304${Math.floor(1000 + Math.random() * 9000)}`;

  // Sugestões de clientes filtradas
  const sugestoesClientes = clientesCadastrados.filter((c) => {
    if (!buscaCliente.trim()) return false;
    const termo = buscaCliente.toLowerCase();
    return (
      c.nome.toLowerCase().includes(termo) ||
      (c.cpf && c.cpf.includes(termo)) ||
      c.telefone.includes(termo)
    );
  });

  const handleSelecionarCliente = (c: Cliente) => {
    setClienteSelecionadoId(c.id);
    setNome(c.nome);
    setCpf(c.cpf || 'Não informado');
    setTelefone(c.telefone);
    setEmail(c.email);
    setBuscaCliente(c.nome);
    setMostrarSugestoes(false);
    setErro('');
  };

  const handleCopiarChave = () => {
    navigator.clipboard.writeText(chavePixOficial);
    setChaveCopiada(true);
    setTimeout(() => setChaveCopiada(false), 3000);
  };

  const handleCopiarCopiaCola = () => {
    navigator.clipboard.writeText(codigoPixCopiaCola);
    setCopiaColaCopiado(true);
    setTimeout(() => setCopiaColaCopiado(false), 3000);
  };

  const handleValidarAvancar = () => {
    if (!nome.trim()) {
      setErro('Por favor, informe o nome completo do comprador.');
      return;
    }
    if (!cpf.trim()) {
      setErro('Informe o CPF para emissão da nota e garantia de 6 meses.');
      return;
    }
    if (!telefone.trim()) {
      setErro('Informe o telefone / WhatsApp do comprador.');
      return;
    }
    setErro('');
    setEtapa('recibo');
  };

  const handleFinalizar = () => {
    onConfirmarVenda({
      bicicletaId: bike.id,
      bicicletaDescricao: `${bike.marca} ${bike.modelo} (${bike.cor}, ${bike.ano})`,
      clienteNome: nome,
      clienteCpf: cpf,
      clienteTelefone: telefone,
      clienteEmail: email,
      valorOriginal: bike.valor,
      desconto,
      valorFinal,
      formaPagamento,
      parcelas: formaPagamento === 'CARTAO_CREDITO' ? parcelas : 1,
      dataVenda: new Date().toISOString().split('T')[0],
      garantiaMeses: 6,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fadeIn max-h-[92vh] flex flex-col">
        
        {/* Header do Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2C3E50] to-[#1E293B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Venda de Semi-Nova
                </span>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 6 Meses Garantia
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Registro de Venda & Checkout de Pagamento
              </h2>
            </div>
          </div>
          <button
            onClick={onFechar}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumo da Bicicleta no Topo */}
        <div className="p-4 bg-orange-50/70 border-b border-orange-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={bike.imagemUrl}
              alt={bike.modelo}
              className="w-12 h-12 rounded-xl object-cover border border-orange-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-[#E67E22]">{bike.marca} • Ano {bike.ano}</span>
              <h3 className="text-sm font-black text-slate-800">{bike.modelo}</h3>
              <p className="text-xs text-slate-500">Cor: {bike.cor} | Categoria: {bike.faixaEtaria}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Preço Tabela</span>
            <span className="text-base font-black text-slate-900">
              R$ {bike.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Conteúdo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{erro}</span>
            </div>
          )}

          {etapa === 'pagamento' ? (
            <div className="space-y-6">
              {/* Seção 1: Identificação do Comprador */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <User className="w-4 h-4 text-[#E67E22]" />
                    <span>1. Dados do Comprador / Nota</span>
                  </div>
                  {clienteSelecionadoId && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Cliente Vinculado
                    </span>
                  )}
                </div>

                {/* Busca Rápida */}
                <div className="relative">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Buscar Cliente Já Cadastrado (Nome, CPF ou Telefone)
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={buscaCliente}
                      onChange={(e) => {
                        setBuscaCliente(e.target.value);
                        setMostrarSugestoes(true);
                      }}
                      onFocus={() => setMostrarSugestoes(true)}
                      placeholder="Buscar por nome ou CPF..."
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  {mostrarSugestoes && sugestoesClientes.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-48 overflow-y-auto divide-y divide-slate-100">
                      {sugestoesClientes.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelecionarCliente(c)}
                          className="w-full text-left p-3 hover:bg-orange-50/80 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <p className="text-xs font-bold text-slate-800">{c.nome}</p>
                            <p className="text-[11px] text-slate-400">CPF: {c.cpf || 'S/N'} • Tel: {c.telefone}</p>
                          </div>
                          <span className="text-[10px] font-bold text-[#E67E22] bg-orange-100 px-2 py-0.5 rounded-full">
                            Selecionar
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inputs do Comprador */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nome Completo do Comprador <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Rodrigo Henrique Lima"
                      required
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      CPF do Comprador <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                      required
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Telefone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      required
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      E-mail para Envio do Comprovante
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="comprador@email.com"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Negociação & Desconto */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <span className="text-[11px] uppercase font-bold text-slate-500 block">Valor Original</span>
                  <span className="text-lg font-black text-slate-700">
                    R$ {bike.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Desconto Concedido (R$)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      value={desconto}
                      onChange={(e) => setDesconto(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-orange-200 text-right">
                  <span className="text-[10px] uppercase font-bold text-orange-600 block">Valor Final a Pagar</span>
                  <span className="text-xl font-black text-[#E67E22]">
                    R$ {valorFinal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Seção 3: Formas de Pagamento (PIX, Cartão de Crédito, Cartão de Débito, Dinheiro) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <CreditCard className="w-4 h-4 text-[#E67E22]" />
                  <span>3. Escolha a Forma de Pagamento</span>
                </div>

                {/* Abas de Formas de Pagamento */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormaPagamento('PIX')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formaPagamento === 'PIX'
                        ? 'border-[#E67E22] bg-orange-50/70 text-[#E67E22] ring-2 ring-orange-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span className="text-xs">PIX Instantâneo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('CARTAO_CREDITO')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formaPagamento === 'CARTAO_CREDITO'
                        ? 'border-[#E67E22] bg-orange-50/70 text-[#E67E22] ring-2 ring-orange-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Cartão de Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('CARTAO_DEBITO')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formaPagamento === 'CARTAO_DEBITO'
                        ? 'border-[#E67E22] bg-orange-50/70 text-[#E67E22] ring-2 ring-orange-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="text-xs">Cartão de Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormaPagamento('DINHEIRO')}
                    className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      formaPagamento === 'DINHEIRO'
                        ? 'border-[#E67E22] bg-orange-50/70 text-[#E67E22] ring-2 ring-orange-500/20 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span className="text-xs">Dinheiro em Espécie</span>
                  </button>
                </div>

                {/* Painel do PIX */}
                {formaPagamento === 'PIX' && (
                  <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-700 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* QR Code Ilustrativo */}
                    <div className="sm:col-span-4 flex flex-col items-center justify-center p-4 bg-white rounded-2xl">
                      <div className="w-36 h-36 border-4 border-slate-900 p-1 flex flex-col items-center justify-center relative bg-white">
                        {/* Grade simulada de QR Code */}
                        <div className="w-full h-full bg-slate-900/5 grid grid-cols-6 grid-rows-6 gap-1 p-1">
                          <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                          <div className="col-span-2 bg-slate-900 rounded-sm"></div>
                          <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                          <div className="col-span-2 bg-slate-900 rounded-sm"></div>
                          <div className="col-span-2 row-span-2 bg-slate-900 rounded-sm"></div>
                          <div className="col-span-2 bg-slate-900 rounded-sm"></div>
                          <div className="col-span-2 bg-slate-900 rounded-sm"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="p-1 bg-white rounded-lg shadow">
                            <span className="text-[9px] font-black text-[#E67E22]">PIX</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 mt-2">Escaneie pelo App do seu Banco</span>
                    </div>

                    {/* Dados Chave & Copia e Cola */}
                    <div className="sm:col-span-8 space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Chave PIX Oficial (E-mail)</span>
                          <button
                            type="button"
                            onClick={handleCopiarChave}
                            className="text-xs text-[#E67E22] hover:text-orange-400 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {chaveCopiada ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{chaveCopiada ? 'Copiada!' : 'Copiar Chave'}</span>
                          </button>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 font-mono text-xs text-orange-400 font-bold mt-1">
                          {chavePixOficial}
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">PIX Copia e Cola</span>
                          <button
                            type="button"
                            onClick={handleCopiarCopiaCola}
                            className="text-xs text-[#E67E22] hover:text-orange-400 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            {copiaColaCopiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiaColaCopiado ? 'Copiado!' : 'Copiar Código'}</span>
                          </button>
                        </div>
                        <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 font-mono text-[11px] text-slate-300 truncate mt-1">
                          {codigoPixCopiaCola}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/40">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Aprovação em tempo real com baixa automática no estoque de semi-novas.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Painel do Cartão de Crédito */}
                {formaPagamento === 'CARTAO_CREDITO' && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Parcelamento (em até 12x)
                        </label>
                        <select
                          value={parcelas}
                          onChange={(e) => setParcelas(Number(e.target.value))}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22] cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 10, 12].map((p) => {
                            const valorParcela = valorFinal / p;
                            return (
                              <option key={p} value={p}>
                                {p}x de R$ {valorParcela.toFixed(2)} {p <= 6 ? '(Sem Juros)' : '(Taxa padrão)'}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Bandeira do Cartão
                        </label>
                        <select
                          value={bandeiraCartao}
                          onChange={(e) => setBandeiraCartao(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22] cursor-pointer"
                        >
                          <option value="Mastercard">Mastercard</option>
                          <option value="Visa">Visa</option>
                          <option value="Elo">Elo</option>
                          <option value="Hipercard">Hipercard</option>
                          <option value="American Express">American Express</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Número do Cartão de Crédito
                        </label>
                        <input
                          type="text"
                          value={numeroCartao}
                          onChange={(e) => setNumeroCartao(e.target.value)}
                          placeholder="4000 1234 5678 9010"
                          className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          Validade / CVV
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={validadeCartao}
                            onChange={(e) => setValidadeCartao(e.target.value)}
                            placeholder="MM/AA"
                            className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                          />
                          <input
                            type="text"
                            value={cvvCartao}
                            onChange={(e) => setCvvCartao(e.target.value)}
                            placeholder="CVV"
                            className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Painel Cartão de Débito */}
                {formaPagamento === 'CARTAO_DEBITO' && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Transação em Maquininha POS (Débito)</h4>
                        <p className="text-xs text-slate-500">Aproxime ou insira o cartão de débito do cliente no terminal BikeHub.</p>
                      </div>
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                      <span className="text-slate-500 font-bold">Valor a ser Cobrado no Terminal:</span>
                      <span className="font-black text-slate-900 text-sm">R$ {valorFinal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Painel Dinheiro */}
                {formaPagamento === 'DINHEIRO' && (
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                        Valor Entregue pelo Cliente (R$)
                      </label>
                      <input
                        type="number"
                        value={valorRecebido}
                        onChange={(e) => setValorRecebido(Number(e.target.value))}
                        className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                      />
                    </div>
                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Troco a Devolver</span>
                      <span className="text-lg font-black text-emerald-600">
                        R$ {Math.max(0, valorRecebido - valorFinal).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ==================================================================
               VISUALIZADOR & EMISSÃO DE RECIBO DE VENDA COM GARANTIA DE 6 MESES
               ================================================================== */
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Venda pronta para registro com Certificado de Garantia de 6 Meses.</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Imprimir Recibo (PDF)</span>
                </button>
              </div>

              {/* Folha Oficial do Recibo */}
              <div className="p-8 bg-white border border-slate-300 rounded-2xl text-slate-800 space-y-6 shadow-sm font-serif">
                <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-wide font-sans">
                      BIKEHUB OFICINA & MOBILIDADE LTDA.
                    </h1>
                    <p className="text-xs font-sans text-slate-600 mt-0.5">
                      CNPJ: 45.987.123/0001-89 • Av. das Bicicletas, 1200 - São Paulo, SP
                    </p>
                    <p className="text-xs font-sans text-slate-600">
                      Telefone: (11) 98765-4321 • vendas@bikehub.com.br
                    </p>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-xs font-bold bg-slate-100 border border-slate-300 px-3 py-1 rounded">
                      COMPROVANTE DE VENDA
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                {/* Dados do Comprador */}
                <div className="bg-slate-50 p-4 border border-slate-200 rounded font-sans text-xs space-y-1">
                  <p><strong>Comprador:</strong> {nome.toUpperCase()}</p>
                  <p><strong>CPF:</strong> {cpf} • <strong>Telefone:</strong> {telefone}</p>
                  <p><strong>E-mail:</strong> {email || 'Não informado'}</p>
                </div>

                {/* Dados da Bicicleta */}
                <div className="font-sans text-xs space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase">Item Adquirido:</h3>
                  <table className="w-full text-left border border-slate-200">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="p-2 border-b border-slate-200">Descrição do Produto</th>
                        <th className="p-2 border-b border-slate-200">Categoria</th>
                        <th className="p-2 border-b border-slate-200 text-right">Valor Final</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 font-bold">{bike.marca} {bike.modelo} ({bike.cor}, {bike.ano})</td>
                        <td className="p-2">{bike.faixaEtaria}</td>
                        <td className="p-2 text-right font-black text-slate-900">R$ {valorFinal.toFixed(2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Pagamento */}
                <div className="font-sans text-xs flex justify-between p-3 bg-slate-50 border border-slate-200 rounded">
                  <div>
                    <span className="text-slate-500 block">Forma de Pagamento:</span>
                    <strong className="text-slate-800">{formaPagamento} {formaPagamento === 'CARTAO_CREDITO' ? `(${parcelas}x)` : ''}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Total Liquidado:</span>
                    <strong className="text-base text-[#E67E22]">R$ {valorFinal.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Termo de Garantia 6 Meses */}
                <div className="p-4 bg-orange-50/60 border border-orange-200 rounded font-sans text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-orange-950">
                    <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
                    <span>CERTIFICADO DE GARANTIA MECÂNICA (6 MESES)</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    A BikeHub assegura garantia total de 180 (cento e oitenta) dias sobre o quadro, soldas, alinhamento e componentes mecânicos inspecionados em nossa oficina, cobrindo eventuais vícios ocultos desde que respeitadas as revisões periódicas recomendadas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {etapa === 'recibo' ? (
            <button
              type="button"
              onClick={() => setEtapa('pagamento')}
              className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              ← Voltar ao Pagamento
            </button>
          ) : (
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
          )}

          <div className="flex items-center gap-3">
            {etapa === 'pagamento' ? (
              <button
                type="button"
                onClick={handleValidarAvancar}
                className="px-6 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Emitir Comprovante de Venda →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizar}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Venda & Baixar Estoque</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
