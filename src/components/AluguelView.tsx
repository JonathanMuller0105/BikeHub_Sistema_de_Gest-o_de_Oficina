/**
 * ======================================================================
 * COMPONENTE: CATÁLOGO DE ALUGUEL E LOCAÇÃO DE BICICLETAS (Dark/Light)
 * Localização: src/components/AluguelView.tsx
 * ======================================================================
 */

import React, { useState } from 'react';
import { 
  CalendarClock, 
  Search, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Printer, 
  FileText, 
  User, 
  Clock, 
  DollarSign, 
  ShieldCheck,
  Bike,
  Plus,
  Layers,
  FileCheck,
  Pencil,
  Trash2
} from 'lucide-react';
import { BicicletaCatalogo, Cliente, AluguelRegistro } from '../types';
import { AluguelModal } from './AluguelModal';
import { DevolucaoModal } from './DevolucaoModal';
import { NovaBicicletaModal } from './NovaBicicletaModal';

interface AluguelViewProps {
  catalogo?: BicicletaCatalogo[];
  clientesCadastrados?: Cliente[];
  alugueis?: AluguelRegistro[];
  onAlternarLocacao: (id: number, alugar: boolean) => void;
  onRegistrarNovoAluguel: (dados: Omit<AluguelRegistro, 'id'>) => void;
  onDevolverAluguel: (contratoId: number, bikeId: number) => void;
  onDevolverAluguelComVistoria?: (dados: {
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
  onCadastrarNovaBicicleta?: (novaBike: Omit<BicicletaCatalogo, 'id'>) => void;
  onAtualizarBicicleta?: (id: number, dados: Omit<BicicletaCatalogo, 'id'>) => void;
  onExcluirBicicleta?: (id: number) => void;
}

export const AluguelView: React.FC<AluguelViewProps> = ({
  catalogo = [],
  clientesCadastrados = [],
  alugueis = [],
  onAlternarLocacao,
  onRegistrarNovoAluguel,
  onDevolverAluguel,
  onDevolverAluguelComVistoria,
  onCadastrarNovaBicicleta,
  onAtualizarBicicleta,
  onExcluirBicicleta,
}) => {
  const [faixaFiltro, setFaixaFiltro] = useState<string>('TODAS');
  const [termo, setTermo] = useState('');
  const [abaExibicao, setAbaExibicao] = useState<'catalogo' | 'contratos'>('catalogo');
  
  // Modais
  const [bikeParaAluguel, setBikeParaAluguel] = useState<BicicletaCatalogo | null>(null);
  const [aluguelParaDevolucao, setAluguelParaDevolucao] = useState<AluguelRegistro | null>(null);
  const [mostrarModalNovaBike, setMostrarModalNovaBike] = useState(false);
  const [bikeEmEdicao, setBikeEmEdicao] = useState<BicicletaCatalogo | null>(null);

  const bicicletasAluguel = catalogo.filter((b) => b.tipo === 'ALUGUEL');

  const bicicletasFiltradas = bicicletasAluguel.filter((b) => {
    const atendeFaixa = faixaFiltro === 'TODAS' || b.faixaEtaria === faixaFiltro;
    const atendeBusca =
      b.marca.toLowerCase().includes(termo.toLowerCase()) ||
      b.modelo.toLowerCase().includes(termo.toLowerCase()) ||
      b.cor.toLowerCase().includes(termo.toLowerCase()) ||
      b.descricao.toLowerCase().includes(termo.toLowerCase());
    return atendeFaixa && atendeBusca;
  });

  const faixas: { chave: string; label: string }[] = [
    { chave: 'TODAS', label: 'Toda a Frota' },
    { chave: 'INFANTIL', label: 'Infantil' },
    { chave: 'JUVENIL', label: 'Juvenil' },
    { chave: 'ADULTO', label: 'Adulto' },
  ];

  const totalEmLocacao = bicicletasAluguel.filter((b) => !b.disponivel).length;
  const totalDisponiveis = bicicletasAluguel.filter((b) => b.disponivel).length;

  // Função para abrir modal de devolução a partir da bike
  const handleIniciarDevolucaoPorBike = (bike: BicicletaCatalogo) => {
    const contratoAtivo = alugueis.find(
      (a) => a.bicicletaId === bike.id && a.status === 'EM_ANDAMENTO'
    );
    if (contratoAtivo) {
      setAluguelParaDevolucao(contratoAtivo);
    } else {
      const contratoTemp: AluguelRegistro = {
        id: Math.max(...alugueis.map((a) => a.id), 0) + 1,
        codigoContrato: `CTR-${bike.id}-RET`,
        bicicletaId: bike.id,
        bicicletaDescricao: `${bike.marca} ${bike.modelo} (${bike.cor}, ${bike.ano})`,
        clienteNome: 'Cliente Registrado na Loja',
        clienteCpf: '000.000.000-00',
        clienteTelefone: '(11) 99999-9999',
        clienteEmail: 'cliente@email.com',
        valorDiaria: bike.valor,
        dataRetirada: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        horaRetirada: '09:00',
        dataDevolucaoPrevista: new Date().toISOString().split('T')[0],
        horaDevolucaoPrevista: '18:00',
        quantidadeDiarias: 1,
        valorTotal: bike.valor,
        valorCaucao: Math.round(bike.valor * 0.15 * 100) / 100,
        formaPagamento: 'PIX',
        status: 'EM_ANDAMENTO',
        acessorios: ['Capacete Higienizado', 'Trava com Chave'],
        dataCriacao: new Date().toISOString(),
      };
      setAluguelParaDevolucao(contratoTemp);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Catálogo de Aluguel e Locação
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Frota de bicicletas para passeios urbanos com emissão instantânea de contrato, caução regulamentar e devolução com vistoria
          </p>
        </div>

        {/* Botões de Ação do Topo */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Botão de Incluir Nova Bike */}
          <button
            onClick={() => setMostrarModalNovaBike(true)}
            className="px-4 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Incluir Nova Bike na Frota</span>
          </button>

          {/* Alternador de visualização: Frota vs Contratos Ativos */}
          <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setAbaExibicao('catalogo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                abaExibicao === 'catalogo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Frota ({bicicletasAluguel.length})
            </button>
            <button
              onClick={() => setAbaExibicao('contratos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                abaExibicao === 'contratos'
                  ? 'bg-white dark:bg-slate-700 text-[#E67E22] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Contratos ({alugueis.length})
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total da Frota</span>
            <p className="text-2xl font-black text-[#2C3E50] dark:text-white mt-1">{bicicletasAluguel.length} Bikes</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#E67E22] flex items-center justify-center font-bold">
            <Bike className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Bicicletas Disponíveis</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalDisponiveis} Prontas</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Locações em Andamento</span>
            <p className="text-2xl font-black text-[#E67E22] mt-1">{totalEmLocacao} Alugadas</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <CalendarClock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {abaExibicao === 'catalogo' ? (
        <>
          {/* Filtros e Busca */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {faixas.map((f) => (
                <button
                  key={f.chave}
                  onClick={() => setFaixaFiltro(f.chave)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    faixaFiltro === f.chave
                      ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/25'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo, cor..."
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          {/* Grid de Cards de Bicicletas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bicicletasFiltradas.map((bike) => {
              const caucaoSugerido15 = Math.round(bike.valor * 0.15 * 100) / 100;
              return (
                <div
                  key={bike.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Imagem com Badges */}
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={bike.imagemUrl}
                        alt={`${bike.marca} ${bike.modelo}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-lg uppercase">
                          {bike.faixaEtaria}
                        </span>
                        {bike.numeroSerie && (
                          <span className="px-2 py-0.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-700 dark:text-slate-300 text-[9px] font-mono font-bold rounded-md">
                            {bike.numeroSerie}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                            bike.disponivel
                              ? 'bg-emerald-500 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          {bike.disponivel ? 'Disponível' : 'Em Locação'}
                        </span>
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                          <span>{bike.marca}</span>
                          <span>Ano {bike.ano}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-900 dark:text-slate-100 mt-0.5">
                          {bike.modelo}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Cor: {bike.cor}</p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {bike.descricao}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#E67E22] shrink-0" />
                        <span>Caução de garantia: a partir de <strong>R$ {caucaoSugerido15.toFixed(2)}</strong> (15% mínimo)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Diária</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          R$ {bike.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400"> / dia</span>
                        </span>
                      </div>

                      <button
                        onClick={() => setBikeEmEdicao(bike)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors cursor-pointer"
                        title="Editar bicicleta"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {onExcluirBicicleta && (
                        <button
                          onClick={() => confirm(`Excluir ${bike.marca} ${bike.modelo} do catálogo?`) && onExcluirBicicleta(bike.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
                          title="Excluir bicicleta"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {bike.disponivel ? (
                        <button
                          onClick={() => setBikeParaAluguel(bike)}
                          className="px-3.5 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <CalendarClock className="w-3.5 h-3.5" />
                          <span>Alugar Agora</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleIniciarDevolucaoPorBike(bike)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Devolver & Vistoria</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* ====================================================================
           TABELA DE CONTRATOS DE LOCAÇÃO CADASTRADOS, VISTORIA & EMISSÃO
           ==================================================================== */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">Contratos de Locação & Histórico de Devoluções</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Contratos emitidos, caução retido/devolvido e quitações</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Contrato</th>
                  <th className="py-3 px-4">Locatário (CPF / Tel)</th>
                  <th className="py-3 px-4">Bicicleta</th>
                  <th className="py-3 px-4">Período / Diárias</th>
                  <th className="py-3 px-4">Valor Total & Caução</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {alugueis.map((aluguel) => {
                  const percentualCaucao = aluguel.valorTotal > 0 ? ((aluguel.valorCaucao / aluguel.valorTotal) * 100).toFixed(0) : '15';
                  return (
                    <tr key={aluguel.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#E67E22]">
                        {aluguel.codigoContrato}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 dark:text-slate-100">{aluguel.clienteNome}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">CPF: {aluguel.clienteCpf} • {aluguel.clienteTelefone}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {aluguel.bicicletaDescricao}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold">{aluguel.dataRetirada} até {aluguel.dataDevolucaoPrevista}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">{aluguel.quantidadeDiarias} diárias</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-black text-slate-900 dark:text-white">R$ {aluguel.valorTotal.toFixed(2)}</p>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-900/50">
                          Caução: R$ {aluguel.valorCaucao.toFixed(2)} ({percentualCaucao}%)
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          aluguel.status === 'EM_ANDAMENTO' 
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50'
                        }`}>
                          {aluguel.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Devolvido / Liquidado'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => window.print()}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                            title="Imprimir Contrato"
                          >
                            <Printer className="w-3 h-3 text-[#E67E22]" />
                            <span>Contrato</span>
                          </button>
                          {aluguel.status === 'EM_ANDAMENTO' ? (
                            <button
                              onClick={() => setAluguelParaDevolucao(aluguel)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Devolver</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => setAluguelParaDevolucao(aluguel)}
                              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer"
                              title="Ver Vistoria / Termo de Devolução"
                            >
                              <FileCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>Termo</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL DE ALUGUEL & IMPRESSÃO DE CONTRATO (COM CAUÇÃO >= 15%)
         ====================================================================== */}
      {bikeParaAluguel && (
        <AluguelModal
          bike={bikeParaAluguel}
          clientesCadastrados={clientesCadastrados}
          onFechar={() => setBikeParaAluguel(null)}
          onConfirmarAluguel={(dados) => {
            onRegistrarNovoAluguel(dados);
            setBikeParaAluguel(null);
          }}
        />
      )}

      {/* ======================================================================
          MODAL DE DEVOLUÇÃO & VISTORIA TÉCNICA COM QUITAÇÃO DE CAUÇÃO
         ====================================================================== */}
      {aluguelParaDevolucao && (
        <DevolucaoModal
          aluguel={aluguelParaDevolucao}
          bike={catalogo.find((b) => b.id === aluguelParaDevolucao.bicicletaId)}
          onFechar={() => setAluguelParaDevolucao(null)}
          onConfirmarDevolucao={(dados) => {
            if (onDevolverAluguelComVistoria) {
              onDevolverAluguelComVistoria(dados);
            } else {
              onDevolverAluguel(dados.contratoId, dados.bikeId);
            }
            setAluguelParaDevolucao(null);
          }}
        />
      )}

      {/* ======================================================================
          MODAL DE CADASTRO DE NOVA BICICLETA (FROTA DE ALUGUEL)
         ====================================================================== */}
      {(mostrarModalNovaBike || bikeEmEdicao) && (
        <NovaBicicletaModal
          tipoInicial={bikeEmEdicao?.tipo ?? 'ALUGUEL'}
          itemEmEdicao={bikeEmEdicao}
          onFechar={() => { setMostrarModalNovaBike(false); setBikeEmEdicao(null); }}
          onSalvarBicicleta={(novaBike) => {
            if (bikeEmEdicao && onAtualizarBicicleta) {
              onAtualizarBicicleta(bikeEmEdicao.id, novaBike);
            } else if (onCadastrarNovaBicicleta) {
              onCadastrarNovaBicicleta(novaBike);
            }
            setMostrarModalNovaBike(false);
            setBikeEmEdicao(null);
          }}
        />
      )}
    </div>
  );
};
