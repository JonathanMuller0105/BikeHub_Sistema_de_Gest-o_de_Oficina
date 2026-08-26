/**
 * ======================================================================
 * COMPONENTE: MODAL DE REALIZAÇÃO DE ALUGUEL & EMISSÃO DE CONTRATO
 * Localização: src/components/AluguelModal.tsx
 * ======================================================================
 * Recursos:
 * - Busca inteligente de clientes já cadastrados (por Nome ou CPF) com auto-preenchimento
 * - Formulário de cadastro de novo locatário caso não esteja no sistema
 * - Seleção de datas/horas, cálculo automático de diárias e valor total
 * - Checkboxes de acessórios (Capacete, Trava, Kit Reparo, Farol)
 * - Emissão e visualização de Contrato de Locação formal com suporte a impressão (window.print())
 */

import React, { useState, useEffect } from 'react';
import { 
  CalendarClock, 
  User, 
  Search, 
  Printer, 
  Check, 
  X, 
  ShieldCheck, 
  Bike, 
  FileText, 
  DollarSign, 
  CreditCard, 
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';
import { BicicletaCatalogo, Cliente, FormaPagamento, AluguelRegistro } from '../types';

interface AluguelModalProps {
  bike: BicicletaCatalogo;
  clientesCadastrados?: Cliente[];
  onFechar: () => void;
  onConfirmarAluguel: (dadosAluguel: Omit<AluguelRegistro, 'id'>) => void;
}

export const AluguelModal: React.FC<AluguelModalProps> = ({
  bike,
  clientesCadastrados = [],
  onFechar,
  onConfirmarAluguel,
}) => {
  // Modo de visualização: 'formulario' ou 'contrato-preview'
  const [etapa, setEtapa] = useState<'formulario' | 'contrato-preview'>('formulario');

  // Busca de cliente
  const [buscaCliente, setBuscaCliente] = useState('');
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [clienteSelecionadoId, setClienteSelecionadoId] = useState<number | null>(null);

  // Dados do Locatário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('Rua dos Ciclistas, 100 - Centro');

  // Período de Locação
  const [dataRetirada, setDataRetirada] = useState(() => new Date().toISOString().split('T')[0]);
  const [horaRetirada, setHoraRetirada] = useState('09:00');
  const [dataDevolucao, setDataDevolucao] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [horaDevolucao, setHoraDevolucao] = useState('18:00');
  
  // Acessórios e Pagamento
  const [acessorios, setAcessorios] = useState<string[]>([
    'Capacete Higienizado',
    'Trava com Chave Reforçada'
  ]);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('PIX');

  // Auto-cálculo de diárias
  const calcularDiarias = () => {
    const inicio = new Date(dataRetirada + 'T00:00:00');
    const fim = new Date(dataDevolucao + 'T00:00:00');
    const diffTime = fim.getTime() - inicio.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const quantidadeDiarias = calcularDiarias();
  const valorTotal = quantidadeDiarias * bike.valor;
  const caucaoMinimo = Math.round(valorTotal * 0.15 * 100) / 100;
  const [valorCaucao, setValorCaucao] = useState<number>(() => Math.max(100, Math.round(bike.valor * 2 * 0.15 * 100) / 100));
  const [erro, setErro] = useState('');

  // Garante que o valor da caução acompanhe o piso de 15% quando o valorTotal aumentar
  useEffect(() => {
    if (valorCaucao < caucaoMinimo) {
      setValorCaucao(caucaoMinimo);
    }
  }, [valorTotal, caucaoMinimo]);

  const codigoContratoGerado = `BH-LOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

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
    setEndereco(c.endereco || 'Endereço cadastrado na base');
    setBuscaCliente(c.nome);
    setMostrarSugestoes(false);
    setErro('');
  };

  const alternarAcessorio = (item: string) => {
    if (acessorios.includes(item)) {
      setAcessorios(acessorios.filter((a) => a !== item));
    } else {
      setAcessorios([...acessorios, item]);
    }
  };

  const handleValidarAvancar = () => {
    if (!nome.trim()) {
      setErro('Informe o nome completo do locatário.');
      return;
    }
    if (!cpf.trim()) {
      setErro('Informe o CPF do locatário para fins contratuais.');
      return;
    }
    if (!telefone.trim()) {
      setErro('Informe o telefone / WhatsApp para contato de emergência.');
      return;
    }
    if (valorCaucao < caucaoMinimo) {
      setErro(`O valor de caução deve ser de no mínimo R$ ${caucaoMinimo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (15% ou mais do valor total de locação R$ ${valorTotal.toFixed(2)}).`);
      return;
    }
    setErro('');
    setEtapa('contrato-preview');
  };

  const handleImprimirContrato = () => {
    window.print();
  };

  const handleFinalizar = () => {
    onConfirmarAluguel({
      codigoContrato: codigoContratoGerado,
      bicicletaId: bike.id,
      bicicletaDescricao: `${bike.marca} ${bike.modelo} (${bike.cor}, ${bike.ano})`,
      clienteNome: nome,
      clienteCpf: cpf,
      clienteTelefone: telefone,
      clienteEmail: email,
      clienteEndereco: endereco,
      dataRetirada,
      horaRetirada,
      dataDevolucaoPrevista: dataDevolucao,
      horaDevolucaoPrevista: horaDevolucao,
      quantidadeDiarias,
      valorDiaria: bike.valor,
      valorTotal,
      valorCaucao,
      formaPagamento,
      acessorios,
      status: 'EM_ANDAMENTO',
      dataCriacao: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      {/* Modal Card */}
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-fadeIn max-h-[92vh] flex flex-col">
        
        {/* Header do Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2C3E50] to-[#1E293B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
              <CalendarClock className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Locação BikeHub
                </span>
                <span className="text-xs text-slate-400 font-mono">Contrato #{codigoContratoGerado}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Aluguel de Bicicleta & Emissão de Contrato
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

        {/* Resumo da Bicicleta Selecionada (Fixado no topo) */}
        <div className="p-4 bg-orange-50/60 border-b border-orange-100 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={bike.imagemUrl}
              alt={bike.modelo}
              className="w-12 h-12 rounded-xl object-cover border border-orange-200 shadow-sm"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] font-bold uppercase text-[#E67E22]">{bike.marca} • {bike.ano}</span>
              <h3 className="text-sm font-black text-slate-800">{bike.modelo}</h3>
              <p className="text-xs text-slate-500">Cor: {bike.cor} | Aro: {bike.faixaEtaria}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Diária Oficial</span>
            <span className="text-base font-black text-[#E67E22]">
              R$ {bike.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / dia
            </span>
          </div>
        </div>

        {/* Corpo do Modal (Scrollável) */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{erro}</span>
            </div>
          )}

          {etapa === 'formulario' ? (
            <div className="space-y-6">
              {/* Seção 1: Busca & Identificação do Locatário */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <User className="w-4 h-4 text-[#E67E22]" />
                    <span>1. Identificação do Locatário</span>
                  </div>
                  {clienteSelecionadoId && (
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3" /> Cliente Vinculado
                    </span>
                  )}
                </div>

                {/* Campo de Busca Rápida de Clientes */}
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
                      placeholder="Digite para autocompletar os dados do cliente..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  {/* Dropdown de sugestões */}
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

                {/* Grid de Campos do Locatário */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Nome Completo do Locatário <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Ex: Carlos Eduardo Silveira"
                      required
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      CPF do Locatário <span className="text-red-500">*</span>
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
                      E-mail para Envio do Contrato
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cliente@email.com"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Endereço Residencial Completo
                    </label>
                    <input
                      type="text"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Rua, Número, Bairro, Cidade - UF"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Período e Agendamento da Locação */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <CalendarClock className="w-4 h-4 text-[#E67E22]" />
                    <span>2. Período da Locação & Diárias</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2.5 py-1 rounded-lg">
                    Total: <strong className="text-[#E67E22]">{quantidadeDiarias} {quantidadeDiarias === 1 ? 'diária' : 'diárias'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Data & Hora de Retirada
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={dataRetirada}
                        onChange={(e) => setDataRetirada(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                      />
                      <input
                        type="time"
                        value={horaRetirada}
                        onChange={(e) => setHoraRetirada(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Data & Hora Prevista de Devolução
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={dataDevolucao}
                        min={dataRetirada}
                        onChange={(e) => setDataDevolucao(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                      />
                      <input
                        type="time"
                        value={horaDevolucao}
                        onChange={(e) => setHoraDevolucao(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção 3: Acessórios e Forma de Pagamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Acessórios Inclusos */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    3. Acessórios e Equipamentos Inclusos
                  </span>
                  {[
                    'Capacete Higienizado',
                    'Trava com Chave Reforçada',
                    'Kit Reparo & Bomba de Ar',
                    'Farol & Lanterna LED Noturna'
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-slate-200/80 cursor-pointer hover:border-orange-300 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={acessorios.includes(item)}
                        onChange={() => alternarAcessorio(item)}
                        className="w-4 h-4 text-[#E67E22] rounded border-slate-300 focus:ring-[#E67E22]"
                      />
                      <span className="text-xs font-semibold text-slate-700">{item}</span>
                    </label>
                  ))}
                </div>

                {/* Forma de Pagamento & Caução */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                    4. Pagamento e Caução
                  </span>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Forma de Pagamento</label>
                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value as FormaPagamento)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22] cursor-pointer"
                    >
                      <option value="PIX">⚡ PIX Instantâneo</option>
                      <option value="CARTAO_CREDITO">💳 Cartão de Crédito</option>
                      <option value="CARTAO_DEBITO">💳 Cartão de Débito</option>
                      <option value="DINHEIRO">💵 Dinheiro / Espécie</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-slate-600">
                        Valor de Caução (Garantia Devolvível)
                      </label>
                      <span className="text-[10px] font-bold text-[#E67E22] bg-orange-100/80 px-2 py-0.5 rounded-md">
                        Mínimo 15%: R$ {caucaoMinimo.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                      <input
                        type="number"
                        step="1"
                        min={caucaoMinimo}
                        value={valorCaucao}
                        onChange={(e) => setValorCaucao(Number(e.target.value))}
                        className={`w-full pl-9 pr-3 py-2 bg-white border rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22] ${
                          valorCaucao < caucaoMinimo
                            ? 'border-red-400 text-red-700 bg-red-50/30'
                            : 'border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    {/* Botões de Seleção Rápida de Caução */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => setValorCaucao(caucaoMinimo)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          valorCaucao === caucaoMinimo
                            ? 'bg-[#E67E22] text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        15% (Mínimo R$ {caucaoMinimo.toFixed(2)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setValorCaucao(Math.round(valorTotal * 0.25 * 100) / 100)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          valorCaucao === Math.round(valorTotal * 0.25 * 100) / 100
                            ? 'bg-[#E67E22] text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        25% (R$ {(valorTotal * 0.25).toFixed(2)})
                      </button>
                      <button
                        type="button"
                        onClick={() => setValorCaucao(Math.round(valorTotal * 0.50 * 100) / 100)}
                        className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                          valorCaucao === Math.round(valorTotal * 0.50 * 100) / 100
                            ? 'bg-[#E67E22] text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        50% (R$ {(valorTotal * 0.50).toFixed(2)})
                      </button>
                    </div>

                    {valorCaucao < caucaoMinimo && (
                      <p className="text-[10px] text-red-600 font-semibold mt-1">
                        ⚠️ O valor de caução deve ser no mínimo 15% (R$ {caucaoMinimo.toFixed(2)}) do valor total do aluguel.
                      </p>
                    )}
                  </div>

                  {/* Resumo de Valores */}
                  <div className="pt-2 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>{quantidadeDiarias}x Diárias (R$ {bike.valor.toFixed(2)})</span>
                      <span className="font-bold text-slate-700">R$ {valorTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Caução ({((valorCaucao / (valorTotal || 1)) * 100).toFixed(0)}% - Mín. 15%)</span>
                      <span className="font-bold text-slate-700">R$ {valorCaucao.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-200">
                      <span>Total da Locação:</span>
                      <span className="text-[#E67E22]">R$ {valorTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================================================================
               VISUALIZADOR & FOLHA DE CONTRATO DE LOCAÇÃO FORMAL
               ================================================================== */
            <div className="space-y-6">
              {/* Barra de Ações do Contrato */}
              <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
                  <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
                  <span>Contrato gerado e formatado para impressão em A4.</span>
                </div>
                <button
                  type="button"
                  onClick={handleImprimirContrato}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-orange-400" />
                  <span>Imprimir Contrato (PDF)</span>
                </button>
              </div>

              {/* Folha Oficial de Impressão do Contrato */}
              <div id="folha-contrato-impressao" className="p-8 bg-white border border-slate-300 rounded-2xl text-slate-800 space-y-6 shadow-sm font-serif">
                {/* Cabeçalho do Contrato */}
                <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-wide font-sans">
                      BIKEHUB OFICINA & MOBILIDADE LTDA.
                    </h1>
                    <p className="text-xs font-sans text-slate-600 mt-0.5">
                      CNPJ: 45.987.123/0001-89 • Av. das Bicicletas, 1200 - São Paulo, SP
                    </p>
                    <p className="text-xs font-sans text-slate-600">
                      Contato: (11) 98765-4321 • locacao@bikehub.com.br
                    </p>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-xs font-bold bg-slate-100 border border-slate-300 px-3 py-1 rounded">
                      CONTRATO #{codigoContratoGerado}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="text-center py-2">
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 underline font-sans">
                    INSTRUMENTO PARTICULAR DE LOCAÇÃO DE BICICLETA E TERMO DE RESPONSABILIDADE
                  </h2>
                </div>

                {/* Cláusula 1: Das Partes */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <h3 className="font-bold text-slate-900 uppercase font-sans">1. DAS PARTES CONTRATANTES</h3>
                  <p>
                    <strong>LOCADORA:</strong> BIKEHUB OFICINA & MOBILIDADE LTDA., sediada em São Paulo/SP.
                  </p>
                  <p>
                    <strong>LOCATÁRIO(A):</strong> {nome.toUpperCase()}, portador(a) do CPF nº <strong>{cpf}</strong>, Telefone: <strong>{telefone}</strong>, E-mail: <strong>{email || 'Não informado'}</strong>, residente em <strong>{endereco}</strong>.
                  </p>
                </div>

                {/* Cláusula 2: Do Objeto Locado */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <h3 className="font-bold text-slate-900 uppercase font-sans">2. DO OBJETO LOCADO E ESPECIFICAÇÕES</h3>
                  <p>
                    A LOCADORA cede em locação temporária ao LOCATÁRIO a seguinte bicicleta inspecionada e em perfeito estado mecânico de conservação e segurança:
                  </p>
                  <div className="bg-slate-50 p-3 border border-slate-200 rounded font-sans text-xs grid grid-cols-2 gap-2">
                    <div><strong>Marca/Modelo:</strong> {bike.marca} {bike.modelo}</div>
                    <div><strong>Ano/Cor:</strong> {bike.ano} - {bike.cor}</div>
                    <div><strong>Categoria/Aro:</strong> {bike.faixaEtaria}</div>
                    <div><strong>Acessórios Inclusos:</strong> {acessorios.join(', ') || 'Nenhum'}</div>
                  </div>
                </div>

                {/* Cláusula 3: Prazos e Valores */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <h3 className="font-bold text-slate-900 uppercase font-sans">3. DOS PRAZOS, VALORES E CAUÇÃO DE GARANTIA (MÍNIMO 15%)</h3>
                  <p>
                    A locação vigorará a partir de <strong>{new Date(dataRetirada + 'T00:00:00').toLocaleDateString('pt-BR')} às {horaRetirada}</strong> com devolução impreterível até <strong>{new Date(dataDevolucao + 'T00:00:00').toLocaleDateString('pt-BR')} às {horaDevolucao}</strong>, totalizando <strong>{quantidadeDiarias} diária(s)</strong>.
                  </p>
                  <p>
                    O valor total ajustado é de <strong>R$ {valorTotal.toFixed(2)}</strong>, pago via <strong>{formaPagamento}</strong>, além de depósito caução de garantia no valor de <strong>R$ {valorCaucao.toFixed(2)}</strong> (equivalente a {((valorCaucao / (valorTotal || 1)) * 100).toFixed(0)}% do valor total da locação, atendendo à exigência regulamentar de no mínimo 15%), o qual será integralmente restituído no ato da devolução do veículo no mesmo estado recebido.
                  </p>
                </div>

                {/* Cláusula 4: Obrigações e Danos */}
                <div className="space-y-2 text-xs leading-relaxed">
                  <h3 className="font-bold text-slate-900 uppercase font-sans">4. DAS OBRIGAÇÕES E RESPONSABILIDADES</h3>
                  <p>
                    O LOCATÁRIO declara receber a bicicleta em perfeito estado de funcionamento e conservação, obrigando-se a utilizá-la conforme as leis de trânsito vigentes, utilizando capacete de segurança, e respondendo civil e criminalmente por eventuais perdas, avarias mecânicas, roubo, furto ou danos a terceiros ocorridos durante o período sob sua custódia.
                  </p>
                </div>

                {/* Assinaturas */}
                <div className="pt-10 grid grid-cols-2 gap-10 font-sans text-center text-xs">
                  <div>
                    <div className="border-t border-slate-700 pt-2 font-bold text-slate-900">
                      BIKEHUB OFICINA & MOBILIDADE LTDA.
                    </div>
                    <span className="text-[10px] text-slate-500">Locadora Autorizada</span>
                  </div>
                  <div>
                    <div className="border-t border-slate-700 pt-2 font-bold text-slate-900">
                      {nome.toUpperCase()}
                    </div>
                    <span className="text-[10px] text-slate-500">Locatário(a) - CPF: {cpf}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {etapa === 'contrato-preview' ? (
            <button
              type="button"
              onClick={() => setEtapa('formulario')}
              className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              ← Voltar aos Dados
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
            {etapa === 'formulario' ? (
              <button
                type="button"
                onClick={handleValidarAvancar}
                className="px-6 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Gerar Contrato de Locação →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizar}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Locação e Liberar Bicicleta</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
