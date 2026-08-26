/**
 * ======================================================================
 * COMPONENTE: MODAL DE DEVOLUÇÃO DE LOCAÇÃO & VISTORIA DE RETORNO
 * Localização: src/components/DevolucaoModal.tsx
 * ======================================================================
 * Funcionalidades:
 * - Vistoria técnica e checklist de retorno da bicicleta
 * - Conferência de acessórios devolvidos
 * - Cálculo de estorno/restituição do caução (com eventual desconto de avaria/multa)
 * - Escolha da forma de devolução do caução (PIX, Dinheiro, Estorno)
 * - Emissão e impressão do Termo de Devolução e Quitação de Locação (PDF/Print)
 */

import React, { useState } from 'react';
import { 
  RotateCcw, 
  X, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Printer, 
  FileCheck, 
  DollarSign, 
  Bike, 
  User, 
  Calendar, 
  Clock, 
  Sparkles,
  ClipboardCheck,
  CreditCard,
  QrCode
} from 'lucide-react';
import { AluguelRegistro, BicicletaCatalogo } from '../types';

interface DevolucaoModalProps {
  aluguel: AluguelRegistro;
  bike?: BicicletaCatalogo;
  onFechar: () => void;
  onConfirmarDevolucao: (dados: {
    contratoId: number;
    bikeId: number;
    dataDevolucaoEfetiva: string;
    horaDevolucaoEfetiva: string;
    valorCaucaoDevolvido: number;
    taxaAvariaOuAtraso: number;
    motivoTaxa?: string;
    metodoDevolucaoCaucao: string;
    observacaoDevolucao: string;
  }) => void;
}

export const DevolucaoModal: React.FC<DevolucaoModalProps> = ({
  aluguel,
  bike,
  onFechar,
  onConfirmarDevolucao,
}) => {
  const [etapa, setEtapa] = useState<'vistoria' | 'recibo-preview'>('vistoria');
  
  // Datas e Horas de Devolução
  const [dataDevolucaoEfetiva, setDataDevolucaoEfetiva] = useState(() => new Date().toISOString().split('T')[0]);
  const [horaDevolucaoEfetiva, setHoraDevolucaoEfetiva] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Checklist de Vistoria
  const [vistoria, setVistoria] = useState({
    quadroOk: true,
    freiosOk: true,
    cambioOk: true,
    pneusOk: true,
    limpezaOk: true,
  });

  // Acessórios devolvidos
  const [acessoriosDevolvidos, setAcessoriosDevolvidos] = useState<string[]>(aluguel.acessorios || []);

  // Financeiro e Caução
  const [taxaAvaria, setTaxaAvaria] = useState<number>(0);
  const [motivoTaxa, setMotivoTaxa] = useState('');
  const [metodoDevolucaoCaucao, setMetodoDevolucaoCaucao] = useState('PIX Instantâneo');
  const [observacoes, setObservacoes] = useState('Bicicleta devolvida em perfeito estado de conservação mecânica e visual.');
  const [erro, setErro] = useState('');

  // Cálculo do caução a devolver
  const caucaoOriginal = aluguel.valorCaucao || 0;
  const valorCaucaoLiquidoDevolver = Math.max(0, caucaoOriginal - taxaAvaria);

  const alternarItemVistoria = (chave: keyof typeof vistoria) => {
    setVistoria((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  const alternarAcessorioDevolvido = (item: string) => {
    if (acessoriosDevolvidos.includes(item)) {
      setAcessoriosDevolvidos(acessoriosDevolvidos.filter((a) => a !== item));
    } else {
      setAcessoriosDevolvidos([...acessoriosDevolvidos, item]);
    }
  };

  const handleValidar = () => {
    if (taxaAvaria > 0 && !motivoTaxa.trim()) {
      setErro('Informe o motivo da retenção parcial/taxa de avaria ou atraso.');
      return;
    }
    if (taxaAvaria > caucaoOriginal) {
      setErro('A taxa de avaria não pode exceder o valor total do caução retido.');
      return;
    }
    setErro('');
    setEtapa('recibo-preview');
  };

  const handleConcluirDevolucao = () => {
    onConfirmarDevolucao({
      contratoId: aluguel.id,
      bikeId: aluguel.bicicletaId,
      dataDevolucaoEfetiva,
      horaDevolucaoEfetiva,
      valorCaucaoDevolvido: valorCaucaoLiquidoDevolver,
      taxaAvariaOuAtraso: taxaAvaria,
      motivoTaxa: taxaAvaria > 0 ? motivoTaxa : undefined,
      metodoDevolucaoCaucao,
      observacaoDevolucao: observacoes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2C3E50] to-[#1E293B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Devolução de Locação
                </span>
                <span className="text-xs text-slate-300 font-mono">Contrato #{aluguel.codigoContrato}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                Check-in de Retorno & Vistoria da Bicicleta
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

        {/* Resumo da Locação e Locatário */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4 shrink-0 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#E67E22] flex items-center justify-center font-bold shrink-0">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Bicicleta Locada</span>
              <p className="font-black text-slate-800 text-sm">{aluguel.bicicletaDescricao}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Locatário(a)</span>
              <p className="font-bold text-slate-800">{aluguel.clienteNome}</p>
              <p className="text-[11px] text-slate-500">CPF: {aluguel.clienteCpf} • {aluguel.clienteTelefone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Período Contratado</span>
              <p className="font-bold text-slate-800">{aluguel.dataRetirada} até {aluguel.dataDevolucaoPrevista}</p>
              <p className="text-[11px] text-slate-500">{aluguel.quantidadeDiarias} diárias • Total R$ {aluguel.valorTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {erro && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
              <span>{erro}</span>
            </div>
          )}

          {etapa === 'vistoria' ? (
            <div className="space-y-6">
              
              {/* Seção 1: Data e Hora da Devolução */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <Clock className="w-4 h-4 text-[#E67E22]" />
                  <span>1. Registro de Data & Hora Efetiva da Devolução</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Data da Entrega / Check-in
                    </label>
                    <input
                      type="date"
                      value={dataDevolucaoEfetiva}
                      onChange={(e) => setDataDevolucaoEfetiva(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Hora da Entrega
                    </label>
                    <input
                      type="time"
                      value={horaDevolucaoEfetiva}
                      onChange={(e) => setHoraDevolucaoEfetiva(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Checklist Técnico de Vistoria */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <ClipboardCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. Checklist de Vistoria Mecânica e Integridade</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Inspeção Obrigatória
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    vistoria.quadroOk ? 'bg-white border-emerald-300 text-slate-800' : 'bg-red-50/60 border-red-300 text-red-800'
                  }`}>
                    <input
                      type="checkbox"
                      checked={vistoria.quadroOk}
                      onChange={() => alternarItemVistoria('quadroOk')}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <div>
                      <p className="text-xs font-bold">Quadro, Garfo & Pintura Íntegros</p>
                      <p className="text-[10px] text-slate-400">Sem trincas, amassados ou riscos graves</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    vistoria.freiosOk ? 'bg-white border-emerald-300 text-slate-800' : 'bg-red-50/60 border-red-300 text-red-800'
                  }`}>
                    <input
                      type="checkbox"
                      checked={vistoria.freiosOk}
                      onChange={() => alternarItemVistoria('freiosOk')}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <div>
                      <p className="text-xs font-bold">Freios & Cabos Operacionais</p>
                      <p className="text-[10px] text-slate-400">Pastilhas e manetes com frenagem firme</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    vistoria.cambioOk ? 'bg-white border-emerald-300 text-slate-800' : 'bg-red-50/60 border-red-300 text-red-800'
                  }`}>
                    <input
                      type="checkbox"
                      checked={vistoria.cambioOk}
                      onChange={() => alternarItemVistoria('cambioOk')}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <div>
                      <p className="text-xs font-bold">Câmbios, Corrente & Pedais</p>
                      <p className="text-[10px] text-slate-400">Trocas de marcha e tração alinhadas</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                    vistoria.pneusOk ? 'bg-white border-emerald-300 text-slate-800' : 'bg-red-50/60 border-red-300 text-red-800'
                  }`}>
                    <input
                      type="checkbox"
                      checked={vistoria.pneusOk}
                      onChange={() => alternarItemVistoria('pneusOk')}
                      className="w-4 h-4 text-emerald-600 rounded"
                    />
                    <div>
                      <p className="text-xs font-bold">Rodas, Raios & Pneus Calibrados</p>
                      <p className="text-[10px] text-slate-400">Aros centrados e sem furos ou cortes</p>
                    </div>
                  </label>
                </div>

                {/* Conferência de Acessórios */}
                <div className="pt-2">
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Acessórios Entregues na Retirada:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {(aluguel.acessorios && aluguel.acessorios.length > 0 ? aluguel.acessorios : ['Capacete Higienizado', 'Trava com Chave']).map((item) => {
                      const devolvido = acessoriosDevolvidos.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => alternarAcessorioDevolvido(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            devolvido
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-red-100 text-red-800 border border-red-300 line-through opacity-70'
                          }`}
                        >
                          {devolvido ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <X className="w-3.5 h-3.5 text-red-600" />}
                          <span>{item} ({devolvido ? 'Devolvido' : 'Faltando'})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Seção 3: Reembolso & Quitação do Caução */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>3. Restituição / Estorno do Caução de Garantia</span>
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    Caução Inicial Retido: <strong className="text-slate-900 font-mono">R$ {caucaoOriginal.toFixed(2)}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Desconto por Avaria ou Multa por Atraso (R$)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                      <input
                        type="number"
                        step="10"
                        min="0"
                        max={caucaoOriginal}
                        value={taxaAvaria}
                        onChange={(e) => setTaxaAvaria(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Forma de Devolução / Estorno ao Cliente
                    </label>
                    <select
                      value={metodoDevolucaoCaucao}
                      onChange={(e) => setMetodoDevolucaoCaucao(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22] cursor-pointer"
                    >
                      <option value="PIX Instantâneo">⚡ PIX Instantâneo (Chave do Locatário)</option>
                      <option value="Dinheiro em Espécie">💵 Dinheiro / Espécie no Balcão</option>
                      <option value="Estorno no Cartão de Crédito">💳 Estorno / Cancelamento de Pré-Autorização</option>
                      <option value="Crédito em Serviços BikeHub">🚲 Crédito para Serviços / Oficina</option>
                    </select>
                  </div>

                  {taxaAvaria > 0 && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-red-700 mb-1">
                        Justificativa da Retenção / Reparo do Dano <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={motivoTaxa}
                        onChange={(e) => setMotivoTaxa(e.target.value)}
                        placeholder="Ex: Pneu traseiro furado / Atraso de 4 horas sem aviso prévio"
                        className="w-full px-3.5 py-2 bg-white border border-red-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                      />
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parecer e Observações do Mecânico / Atendente
                    </label>
                    <textarea
                      rows={2}
                      value={observacoes}
                      onChange={(e) => setObservacoes(e.target.value)}
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                    />
                  </div>
                </div>

                {/* Box de Resumo Financeiro da Devolução */}
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 block">Total a Reembolsar / Estornar</span>
                    <p className="text-2xl font-black text-emerald-700">
                      R$ {valorCaucaoLiquidoDevolver.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <span className="text-[11px] text-emerald-600 font-medium">
                      Via {metodoDevolucaoCaucao}
                    </span>
                  </div>

                  <div className="text-right text-xs space-y-0.5 text-slate-600">
                    <p>Caução Retido Inicial: <strong>R$ {caucaoOriginal.toFixed(2)}</strong></p>
                    {taxaAvaria > 0 && (
                      <p className="text-red-600 font-bold">(-) Retenção / Avaria: R$ {taxaAvaria.toFixed(2)}</p>
                    )}
                    <p className="text-emerald-700 font-bold pt-1 border-t border-emerald-200">
                      (=) Quitação Liquidada com Sucesso
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ==================================================================
               VISUALIZADOR & FOLHA DE TERMO DE DEVOLUÇÃO E QUITAÇÃO (A4)
               ================================================================== */
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <FileCheck className="w-4 h-4 text-emerald-600" />
                  <span>Termo de Devolução pronto para impressão e assinatura do cliente.</span>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-400" />
                  <span>Imprimir Recibo de Devolução (PDF)</span>
                </button>
              </div>

              {/* Folha Oficial de Impressão de Devolução */}
              <div id="folha-devolucao-impressao" className="p-8 bg-white border border-slate-300 rounded-2xl text-slate-800 space-y-6 shadow-sm font-serif">
                <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-wide font-sans">
                      BIKEHUB OFICINA & MOBILIDADE LTDA.
                    </h1>
                    <p className="text-xs font-sans text-slate-600 mt-0.5">
                      CNPJ: 45.987.123/0001-89 • Av. das Bicicletas, 1200 - São Paulo, SP
                    </p>
                    <p className="text-xs font-sans text-slate-600">
                      Central de Locação: (11) 98765-4321 • locacao@bikehub.com.br
                    </p>
                  </div>
                  <div className="text-right font-sans">
                    <span className="text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 px-3 py-1 rounded">
                      DEVOLUÇÃO #{aluguel.codigoContrato}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">Data Devolução: {new Date(dataDevolucaoEfetiva + 'T00:00:00').toLocaleDateString('pt-BR')} às {horaDevolucaoEfetiva}</p>
                  </div>
                </div>

                <div className="text-center py-2">
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 underline font-sans">
                    TERMO DE RECEBIMENTO, VISTORIA E QUITAÇÃO DE CAUÇÃO
                  </h2>
                </div>

                {/* Dados da Devolução */}
                <div className="space-y-2 text-xs leading-relaxed font-sans">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2">
                    <div><strong>Locatário:</strong> {aluguel.clienteNome}</div>
                    <div><strong>CPF:</strong> {aluguel.clienteCpf}</div>
                    <div><strong>Bicicleta Devolvida:</strong> {aluguel.bicicletaDescricao}</div>
                    <div><strong>Período Efetivo:</strong> {aluguel.dataRetirada} até {dataDevolucaoEfetiva}</div>
                    <div><strong>Caução Original:</strong> R$ {caucaoOriginal.toFixed(2)}</div>
                    <div><strong>Taxa/Retenção:</strong> R$ {taxaAvaria.toFixed(2)} {taxaAvaria > 0 ? `(${motivoTaxa})` : ''}</div>
                    <div className="col-span-2 pt-1 border-t border-slate-200 font-bold text-emerald-800 text-sm">
                      Valor Devolvido / Estornado ao Cliente: R$ {valorCaucaoLiquidoDevolver.toFixed(2)} ({metodoDevolucaoCaucao})
                    </div>
                  </div>
                </div>

                {/* Vistoria Checklist */}
                <div className="space-y-1 text-xs leading-relaxed font-sans">
                  <h3 className="font-bold text-slate-900 uppercase">RESULTADO DA VISTORIA TÉCNICA</h3>
                  <p>
                    A LOCADORA declara que a bicicleta e seus acessórios foram devidamente inspecionados no ato da entrega e recolocados no estoque aptos para novas locações.
                  </p>
                  <p className="text-[11px] text-slate-600">
                    <strong>Parecer Técnico:</strong> {observacoes}
                  </p>
                </div>

                {/* Assinaturas */}
                <div className="pt-10 grid grid-cols-2 gap-10 font-sans text-center text-xs">
                  <div>
                    <div className="border-t border-slate-700 pt-2 font-bold text-slate-900">
                      BIKEHUB OFICINA & MOBILIDADE LTDA.
                    </div>
                    <span className="text-[10px] text-slate-500">Vistoriador / Responsável Técnico</span>
                  </div>
                  <div>
                    <div className="border-t border-slate-700 pt-2 font-bold text-slate-900">
                      {aluguel.clienteNome.toUpperCase()}
                    </div>
                    <span className="text-[10px] text-slate-500">Locatário(a) - Quitação do Caução</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          {etapa === 'recibo-preview' ? (
            <button
              type="button"
              onClick={() => setEtapa('vistoria')}
              className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              ← Voltar à Vistoria
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
            {etapa === 'vistoria' ? (
              <button
                type="button"
                onClick={handleValidar}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                <span>Validar Vistoria & Gerar Termo →</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConcluirDevolucao}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Confirmar Devolução & Liberar Bike</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
