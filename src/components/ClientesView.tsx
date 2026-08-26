/**
 * ======================================================================
 * COMPONENTE: LISTA DE CLIENTES (COM SUPORTE A TEMA CLARO E ESCURO)
 * Localização: src/components/ClientesView.tsx
 * ======================================================================
 */

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Trash2, 
  Wrench, 
  Bike, 
  Phone, 
  Mail, 
  CreditCard 
} from 'lucide-react';
import { Cliente, AbaNavegacao } from '../types';

interface ClientesViewProps {
  clientes?: Cliente[];
  onNavegar: (aba: AbaNavegacao) => void;
  onExcluirCliente: (id: number) => void;
  onAbrirOSParaCliente: (clienteId: number) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  clientes = [],
  onNavegar,
  onExcluirCliente,
  onAbrirOSParaCliente,
}) => {
  const [termo, setTermo] = useState('');

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(termo.toLowerCase()) ||
      c.email.toLowerCase().includes(termo.toLowerCase()) ||
      c.telefone.includes(termo)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Clientes Cadastrados
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie os clientes e suas respectivas bicicletas vinculadas para ordens de serviço
          </p>
        </div>
        <button
          onClick={() => onNavegar('cliente-novo')}
          className="px-4 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Novo Cadastro Integrado</span>
        </button>
      </div>

      {/* Barra de Busca */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
            placeholder="Pesquisar cliente por nome, e-mail ou telefone..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
          />
        </div>
        {termo && (
          <button
            onClick={() => setTermo('')}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-3 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl cursor-pointer"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/70 dark:border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-6"># ID</th>
                <th className="py-3.5 px-6">Nome do Cliente</th>
                <th className="py-3.5 px-6">Contato</th>
                <th className="py-3.5 px-6">Bicicletas Registradas</th>
                <th className="py-3.5 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-500 dark:text-slate-400">#{cliente.id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#2C3E50] dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {cliente.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-100">{cliente.nome}</p>
                        {cliente.cpf && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                            <CreditCard className="w-3 h-3" /> CPF: {cliente.cpf}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 text-xs">
                      <Phone className="w-3.5 h-3.5 text-[#E67E22]" /> {cliente.telefone}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {cliente.email}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {cliente.bicicletas && cliente.bicicletas.length > 0 ? (
                        cliente.bicicletas.map((b) => (
                          <span
                            key={b.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300"
                          >
                            <Bike className="w-3 h-3 text-[#E67E22]" />
                            {b.marca} {b.modelo} ({b.ano})
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 italic">Nenhuma bike vinculada</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onAbrirOSParaCliente(cliente.id)}
                        className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/40 hover:bg-[#E67E22] dark:hover:bg-[#E67E22] text-[#E67E22] hover:text-white border border-orange-200 dark:border-orange-900/60 hover:border-transparent rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                        title="Abrir Ordem de Serviço para este cliente"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>+ Abrir OS</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Deseja realmente excluir o cliente "${cliente.nome}"?`)) {
                            onExcluirCliente(cliente.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Excluir Cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {clientesFiltrados.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="font-bold text-slate-700 dark:text-slate-300">Nenhum cliente encontrado</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tente ajustar o termo de pesquisa</p>
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
