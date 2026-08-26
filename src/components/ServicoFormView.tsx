/**
 * ======================================================================
 * COMPONENTE: FORMULÁRIO DE ABERTURA DE ORDEM DE SERVIÇO (OS) (Dark/Light)
 * Localização: src/components/ServicoFormView.tsx
 * ======================================================================
 */

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Wrench, Calendar, DollarSign, User, Bike } from 'lucide-react';
import { Cliente, Servico, StatusServico, AbaNavegacao } from '../types';
import { STATUS_LISTA } from '../data/initialData';

interface ServicoFormViewProps {
  clientes?: Cliente[];
  clientePreSelecionadoId?: number | null;
  onSalvarOS: (novaOS: Omit<Servico, 'id' | 'clienteNome' | 'clienteTelefone' | 'bicicletaDescricao'>) => void;
  onNavegar: (aba: AbaNavegacao) => void;
}

export const ServicoFormView: React.FC<ServicoFormViewProps> = ({
  clientes = [],
  clientePreSelecionadoId,
  onSalvarOS,
  onNavegar,
}) => {
  const [clienteId, setClienteId] = useState<number | ''>(clientePreSelecionadoId || '');
  const [bicicletaId, setBicicletaId] = useState<number | ''>('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [dataEntrega, setDataEntrega] = useState(() => {
    const data = new Date();
    data.setDate(data.getDate() + 3);
    return data.toISOString().split('T')[0];
  });
  const [status, setStatus] = useState<StatusServico>('PENDENTE');
  const [erro, setErro] = useState('');

  // Localiza o cliente atualmente selecionado para extrair suas bicicletas
  const clienteSelecionado = (clientes || []).find((c) => c.id === Number(clienteId));
  const bicicletasDisponiveis = clienteSelecionado?.bicicletas || [];

  // Se o cliente mudar, ajusta a primeira bicicleta automaticamente se existir
  useEffect(() => {
    if (bicicletasDisponiveis.length > 0) {
      setBicicletaId(bicicletasDisponiveis[0].id);
    } else {
      setBicicletaId('');
    }
  }, [clienteId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteId) {
      setErro('Por favor, selecione um cliente cadastrado.');
      return;
    }
    if (!bicicletaId) {
      setErro('Por favor, selecione a bicicleta do cliente. Se ele não possuir bike, cadastre uma antes.');
      return;
    }
    if (!descricao.trim()) {
      setErro('Por favor, descreva detalhadamente os serviços a serem executados.');
      return;
    }
    if (!valor || Number(valor) <= 0) {
      setErro('Por favor, informe um valor válido para a ordem de serviço.');
      return;
    }

    onSalvarOS({
      clienteId: Number(clienteId),
      bicicletaId: Number(bicicletaId),
      descricao,
      valor: Number(valor),
      dataEntrada: new Date().toISOString().split('T')[0],
      dataEntrega,
      status,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Topbar */}
      <div>
        <button
          onClick={() => onNavegar('servicos')}
          className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 mb-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Lista de OS</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
          Abertura de Ordem de Serviço (Oficina)
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Selecione o cliente, a bicicleta e registre os serviços e peças de manutenção
        </p>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1: Seleção de Cliente e Bicicleta */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E67E22] flex items-center justify-center font-black text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-[#E67E22]" /> Vínculo de Cliente e Equipamento
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Identifique o proprietário e selecione o veículo para manutenção</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Cliente Solicitante <span className="text-red-500">*</span>
              </label>
              <select
                value={clienteId}
                onChange={(e) => setClienteId(Number(e.target.value) || '')}
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
              >
                <option value="">-- Selecione o Cliente --</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.telefone})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Bicicleta do Cliente <span className="text-red-500">*</span>
              </label>
              <select
                value={bicicletaId}
                onChange={(e) => setBicicletaId(Number(e.target.value) || '')}
                required
                disabled={!clienteId || bicicletasDisponiveis.length === 0}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900 cursor-pointer disabled:opacity-50"
              >
                <option value="">
                  {!clienteId
                    ? '-- Selecione um cliente primeiro --'
                    : bicicletasDisponiveis.length === 0
                    ? 'Nenhuma bike cadastrada para este cliente'
                    : '-- Selecione a Bicicleta --'}
                </option>
                {bicicletasDisponiveis.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.marca} {b.modelo} - {b.cor} ({b.ano})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Seção 2: Diagnóstico, Valores e Prazos */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E67E22] flex items-center justify-center font-black text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#E67E22]" /> Diagnóstico Mecânico e Orçamento
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Descreva os procedimentos técnicos, peças a repor e prazos de entrega</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              Descrição Detalhada do Serviço e Peças <span className="text-red-500">*</span>
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={4}
              required
              placeholder="Ex: Revisão geral: Sangria de freios hidráulicos, troca de cabos e conduítes de marcha, centragem de rodas e lubrificação de corrente com cera cerâmica..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Valor Total (R$) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">R$</span>
                <input
                  type="number"
                  step="0.01"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  required
                  placeholder="250.00"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Data Prevista de Entrega <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dataEntrega}
                onChange={(e) => setDataEntrega(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Status Inicial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusServico)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
              >
                {Object.values(STATUS_LISTA).map((s) => (
                  <option key={s.chave} value={s.chave}>
                    {s.descricao}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavegar('servicos')}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Abrir Ordem de Serviço</span>
          </button>
        </div>
      </form>
    </div>
  );
};
