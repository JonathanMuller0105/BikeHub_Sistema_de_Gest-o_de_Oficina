/**
 * ======================================================================
 * COMPONENTE: LISTA DE ORDENS DE SERVIÇO (Oficina Mecânica - Dark/Light)
 * Localização: src/components/ServicosView.tsx
 * ======================================================================
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Trash2, 
  Calendar, 
  Bike, 
  Phone, 
  DollarSign, 
  Search,
  Filter,
  Pencil
} from 'lucide-react';
import { Servico, StatusServico, AbaNavegacao } from '../types';
import { STATUS_LISTA } from '../data/initialData';

interface ServicosViewProps {
  servicos?: Servico[];
  onNavegar: (aba: AbaNavegacao) => void;
  onAtualizarStatusOS: (osId: number, novoStatus: StatusServico) => void;
  onExcluirOS: (osId: number) => void;
  onEditarOS: (servico: Servico) => void;
}

export const ServicosView: React.FC<ServicosViewProps> = ({
  servicos = [],
  onNavegar,
  onAtualizarStatusOS,
  onExcluirOS,
  onEditarOS,
}) => {
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [termo, setTermo] = useState('');

  const servicosFiltrados = servicos.filter((s) => {
    const atendeStatus = filtroStatus === 'TODOS' || s.status === filtroStatus;
    const atendeBusca =
      s.clienteNome.toLowerCase().includes(termo.toLowerCase()) ||
      s.bicicletaDescricao.toLowerCase().includes(termo.toLowerCase()) ||
      s.descricao.toLowerCase().includes(termo.toLowerCase()) ||
      `#${s.id}`.includes(termo);
    return atendeStatus && atendeBusca;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Ordens de Serviço da Oficina
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Controle de serviços mecânicos, peças instaladas e workflow de status
          </p>
        </div>
        <button
          onClick={() => onNavegar('servico-novo')}
          className="px-4 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Abrir Nova OS</span>
        </button>
      </div>

      {/* Barra de Filtros por Status */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFiltroStatus('TODOS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
              filtroStatus === 'TODOS'
                ? 'bg-[#2C3E50] dark:bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Todas as OS ({servicos.length})
          </button>
          {Object.values(STATUS_LISTA).map((s) => {
            const count = servicos.filter((item) => item.status === s.chave).length;
            const estaAtivo = filtroStatus === s.chave;
            return (
              <button
                key={s.chave}
                onClick={() => setFiltroStatus(s.chave)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  estaAtivo
                    ? 'ring-2 ring-offset-1 ring-slate-800 dark:ring-white'
                    : 'hover:opacity-85 opacity-70'
                }`}
                style={{ backgroundColor: s.badgeBg, color: s.badgeColor }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.dotColor }} />
                <span>{s.descricao}</span>
                <span className="text-[10px] font-black bg-black/10 px-1.5 py-0.2 rounded-full">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Busca textual */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Buscar por número da OS, nome do cliente, bicicleta ou serviço realizado..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Tabela de OS */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6"># OS</th>
                <th className="py-3.5 px-6">Cliente</th>
                <th className="py-3.5 px-6">Bicicleta</th>
                <th className="py-3.5 px-6 max-w-xs">Diagnóstico & Serviços</th>
                <th className="py-3.5 px-6">Valor Total</th>
                <th className="py-3.5 px-6">Data Prometida</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Alterar Status</th>
                <th className="py-3.5 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {servicosFiltrados.map((os) => {
                const statusMeta = STATUS_LISTA[os.status];
                return (
                  <tr key={os.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-600 dark:text-slate-400">#{os.id}</td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 dark:text-slate-100">{os.clienteNome}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-[#E67E22]" /> {os.clienteTelefone}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Bike className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">{os.bicicletaDescricao}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs">
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2" title={os.descricao}>
                        {os.descricao}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-black text-slate-800 dark:text-white text-sm">
                        R$ {os.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(os.dataEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}</span>
                      </div>
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
                        className="text-xs font-bold py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#E67E22] cursor-pointer"
                      >
                        {Object.values(STATUS_LISTA).map((s) => (
                          <option key={s.chave} value={s.chave} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                            {s.descricao}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => onEditarOS(os)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Editar OS"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja excluir a Ordem de Serviço #${os.id}?`)) {
                            onExcluirOS(os.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir OS"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {servicosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <Wrench className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">Nenhuma Ordem de Serviço encontrada</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tente ajustar o status selecionado ou a pesquisa</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
