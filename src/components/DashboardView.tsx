/**
 * ======================================================================
 * COMPONENTE: DASHBOARD PRINCIPAL (Métricas, Pipeline e Ações Rápidas)
 * Localização: src/components/DashboardView.tsx
 * ======================================================================
 */

import React from 'react';
import { 
  Users, 
  Wrench, 
  ShoppingBag, 
  DollarSign, 
  PlusCircle, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Bike
} from 'lucide-react';
import { Cliente, Servico, BicicletaCatalogo, StatusServico, AbaNavegacao } from '../types';
import { STATUS_LISTA } from '../data/initialData';

interface DashboardViewProps {
  clientes?: Cliente[];
  servicos?: Servico[];
  catalogo?: BicicletaCatalogo[];
  onNavegar: (aba: AbaNavegacao) => void;
  onAtualizarStatusOS: (osId: number, novoStatus: StatusServico) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clientes = [],
  servicos = [],
  catalogo = [],
  onNavegar,
  onAtualizarStatusOS,
}) => {
  // Contagens dinâmicas
  const totalClientes = clientes.length;
  const osEmAndamento = servicos.filter(
    (s) => s.status === 'PENDENTE' || s.status === 'ANALISE' || s.status === 'MANUTENCAO'
  ).length;
  const totalVendasConcluidas = catalogo.filter((b) => b.tipo === 'VENDA' && !b.disponivel).length;
  const faturamentoTotal = servicos.reduce((acc, s) => acc + s.valor, 0) + 
    catalogo.filter((b) => b.tipo === 'VENDA' && !b.disponivel).reduce((acc, b) => acc + b.valor, 0);

  // Pipeline counts
  const contagemPorStatus = (statusChave: StatusServico) =>
    servicos.filter((s) => s.status === statusChave).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Topbar do Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Painel Geral da Oficina
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visão consolidada de ordens de serviço, clientes ativos e inventário comercial
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavegar('servico-novo')}
            className="px-4 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Abrir Nova OS</span>
          </button>
          <button
            onClick={() => onNavegar('cliente-novo')}
            className="px-4 py-2.5 bg-[#2C3E50] hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>+ Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* 1. Grid de 4 Métricas Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Clientes */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#2980B9] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Clientes Ativos</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{totalClientes}</p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> 100% com bikes vinculadas
            </span>
          </div>
        </div>

        {/* Card 2: OS em Andamento */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-[#E67E22] dark:text-amber-400 flex items-center justify-center shrink-0">
            <Wrench className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">OS em Oficina</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{osEmAndamento}</p>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 mt-0.5">
              <Clock className="w-3.5 h-3.5" /> Em execução na bancada
            </span>
          </div>
        </div>

        {/* Card 3: Vendas no Mês */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-[#27AE60] dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Semi-Novas Vendidas</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">{totalVendasConcluidas}</p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Revisão inclusa
            </span>
          </div>
        </div>

        {/* Card 4: Faturamento Total */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-[#2C3E50] dark:text-indigo-300 flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Faturamento Acumulado</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5">
              R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Oficina + Vendas</span>
          </div>
        </div>
      </div>

      {/* 2. Pipeline de Status de Oficina */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-black text-[#2C3E50] dark:text-white">Fluxo de Ordens de Serviço (Pipeline)</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Distribuição das manutenções mecânicas por estágio de atendimento</p>
          </div>
          <button
            onClick={() => onNavegar('servicos')}
            className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todas as OS</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {Object.values(STATUS_LISTA).map((info) => {
            const count = contagemPorStatus(info.chave);
            return (
              <div
                key={info.chave}
                onClick={() => onNavegar('servicos')}
                className="p-4 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: info.dotColor }}
                  />
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: info.badgeBg, color: info.badgeColor }}
                  >
                    {count}
                  </span>
                </div>
                <div className="mt-3">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight">{info.descricao}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Tabela de Últimas Ordens de Serviço */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-[#2C3E50] dark:text-white">Ordens de Serviço Recentes</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Acompanhe as manutenções em tempo real e altere status instantaneamente</p>
          </div>
          <button
            onClick={() => onNavegar('servico-novo')}
            className="text-xs font-bold text-[#E67E22] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Abrir Nova OS</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-400 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6"># OS</th>
                <th className="py-3.5 px-6">Cliente</th>
                <th className="py-3.5 px-6">Bicicleta</th>
                <th className="py-3.5 px-6">Valor Total</th>
                <th className="py-3.5 px-6">Entrega</th>
                <th className="py-3.5 px-6">Status Atual</th>
                <th className="py-3.5 px-6 text-right">Ação Rápida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {servicos.slice(0, 5).map((os) => {
                const statusMeta = STATUS_LISTA[os.status];
                return (
                  <tr key={os.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-700 dark:text-slate-300">#{os.id}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{os.clienteNome}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{os.clienteTelefone}</p>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300">
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[200px]">{os.bicicletaDescricao}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-100">
                      R$ {os.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {new Date(os.dataEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: statusMeta?.badgeBg, color: statusMeta?.badgeColor }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusMeta?.dotColor }}></span>
                        {statusMeta?.descricao}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={os.status}
                        onChange={(e) => onAtualizarStatusOS(os.id, e.target.value as StatusServico)}
                        className="text-xs font-semibold py-1 px-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#E67E22] cursor-pointer"
                      >
                        {Object.values(STATUS_LISTA).map((s) => (
                          <option key={s.chave} value={s.chave} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                            {s.descricao}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
