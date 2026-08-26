/**
 * ======================================================================
 * COMPONENTE: SIDEBAR DE NAVEGAÇÃO (RECOLHÍVEL COM SELETOR DE TEMA)
 * Localização: src/components/Sidebar.tsx
 * ======================================================================
 * Recursos:
 * - Alternância entre modo expandido (w-64) e recolhido (w-20)
 * - Seletor completo de tema: Sistema (Auto), Claro e Escuro
 * - Tooltips informativos quando o menu lateral está recolhido
 * - Destaque visual no módulo ativo e contadores dinâmicos
 */

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ShoppingBag, 
  CalendarClock, 
  FileCode, 
  LogOut, 
  Bike,
  ClipboardList,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { AbaNavegacao, Usuario, ModoTema } from '../types';

interface SidebarProps {
  abaAtiva: AbaNavegacao;
  onNavegar: (aba: AbaNavegacao) => void;
  usuario: Usuario | null;
  onLogout: () => void;
  quantidadeOS: number;
  quantidadeServicosCatalogo?: number;
  recolhida: boolean;
  onAlternarRecolhida: () => void;
  tema: ModoTema;
  onAlterarTema: (tema: ModoTema) => void;
  escuroEfetivo: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  abaAtiva,
  onNavegar,
  usuario,
  onLogout,
  quantidadeOS,
  quantidadeServicosCatalogo = 0,
  recolhida,
  onAlternarRecolhida,
  tema,
  onAlterarTema,
  escuroEfetivo,
}) => {
  const itensMenu = [
    {
      id: 'dashboard' as AbaNavegacao,
      rotulo: 'Painel Geral',
      icone: LayoutDashboard,
      badge: null,
    },
    {
      id: 'clientes' as AbaNavegacao,
      rotulo: 'Clientes & Bikes',
      icone: Users,
      badge: null,
    },
    {
      id: 'servicos' as AbaNavegacao,
      rotulo: 'Ordens de Serviço',
      icone: Wrench,
      badge: quantidadeOS > 0 ? `${quantidadeOS}` : null,
    },
    {
      id: 'tabela-servicos' as AbaNavegacao,
      rotulo: 'Tabela de Serviços',
      icone: ClipboardList,
      badge: quantidadeServicosCatalogo > 0 ? `${quantidadeServicosCatalogo}` : null,
    },
    {
      id: 'vendas' as AbaNavegacao,
      rotulo: 'Venda de Semi-Novas',
      icone: ShoppingBag,
      badge: null,
    },
    {
      id: 'aluguel' as AbaNavegacao,
      rotulo: 'Aluguel / Locação',
      icone: CalendarClock,
      badge: null,
    },
    {
      id: 'usuarios' as AbaNavegacao,
      rotulo: 'Usuários & Equipe',
      icone: UserCog,
      badge: null,
    },
    {
      id: 'codigo-spring' as AbaNavegacao,
      rotulo: 'Código Spring Boot 3',
      icone: FileCode,
      badge: 'Java 21',
    },
  ];

  return (
    <aside
      className={`bg-[#2C3E50] dark:bg-[#0F172A] text-white flex flex-col shrink-0 min-h-screen sticky top-0 border-r border-slate-700 dark:border-slate-800 shadow-xl z-30 transition-all duration-300 ${
        recolhida ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logotipo & Botão de Recolhimento */}
      <div className={`p-4 border-b border-slate-700/60 dark:border-slate-800 flex items-center justify-between ${
        recolhida ? 'flex-col gap-3 py-5' : ''
      }`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E67E22] to-[#D35400] flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
            <Bike className="w-6 h-6" />
          </div>
          {!recolhida && (
            <div className="truncate">
              <h1 className="text-xl font-black tracking-tight text-white flex items-center">
                Bike<span className="text-[#E67E22]">Hub</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Oficina & Mobilidade
              </span>
            </div>
          )}
        </div>

        {/* Botão de Toggle Expandir / Recolher */}
        <button
          onClick={onAlternarRecolhida}
          title={recolhida ? 'Expandir Menu Lateral' : 'Recolher Menu Lateral'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {recolhida ? (
            <PanelLeftOpen className="w-5 h-5 text-orange-400 hover:text-white" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navegação Principal */}
      <nav className="flex-1 px-2.5 py-4 space-y-1.5 overflow-y-auto">
        {!recolhida && (
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Módulos do Sistema
          </div>
        )}
        {itensMenu.map((item) => {
          const Icone = item.icone;
          const estaAtivo =
            abaAtiva === item.id ||
            (item.id === 'clientes' && abaAtiva === 'cliente-novo') ||
            (item.id === 'servicos' && abaAtiva === 'servico-novo');

          return (
            <button
              key={item.id}
              onClick={() => onNavegar(item.id)}
              title={recolhida ? item.rotulo : undefined}
              className={`w-full flex items-center ${
                recolhida ? 'justify-center px-0 py-3' : 'justify-between px-3 py-2.5'
              } rounded-xl font-medium text-sm transition-all duration-150 group relative cursor-pointer ${
                estaAtivo
                  ? 'bg-[#E67E22] text-white shadow-lg shadow-orange-500/25 font-semibold'
                  : 'text-slate-300 hover:bg-slate-700/50 dark:hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icone
                  className={`w-5 h-5 transition-transform duration-150 group-hover:scale-110 shrink-0 ${
                    estaAtivo ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  }`}
                />
                {!recolhida && <span className="truncate">{item.rotulo}</span>}
              </div>

              {/* Badges / Contadores */}
              {!recolhida && item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    estaAtivo
                      ? 'bg-black/20 text-white'
                      : 'bg-[#E67E22]/20 text-[#E67E22] border border-[#E67E22]/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}

              {/* Indicador de Badge quando Recolhida */}
              {recolhida && item.badge && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#E67E22] border-2 border-[#2C3E50] dark:border-[#0F172A] rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Seletor de Tema (Sistema, Claro, Escuro) */}
      <div className="px-3 py-3 border-t border-slate-700/60 dark:border-slate-800 bg-slate-800/20 dark:bg-slate-900/40">
        {!recolhida ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Tema do Sistema
              </span>
              <span className="text-[10px] text-orange-400 font-semibold">
                {tema === 'sistema' ? `Auto (${escuroEfetivo ? 'Escuro' : 'Claro'})` : tema === 'claro' ? 'Claro' : 'Escuro'}
              </span>
            </div>

            {/* Segmented Control dos 3 Temas */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900/60 dark:bg-slate-950 p-1 rounded-xl border border-slate-700/60 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => onAlterarTema('sistema')}
                title="Acompanhar tema do Sistema Operacional"
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  tema === 'sistema'
                    ? 'bg-[#E67E22] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="text-[11px]">Sistema</span>
              </button>

              <button
                type="button"
                onClick={() => onAlterarTema('claro')}
                title="Forçar Tema Claro"
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  tema === 'claro'
                    ? 'bg-[#E67E22] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="text-[11px]">Claro</span>
              </button>

              <button
                type="button"
                onClick={() => onAlterarTema('escuro')}
                title="Forçar Tema Escuro"
                className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  tema === 'escuro'
                    ? 'bg-[#E67E22] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="text-[11px]">Escuro</span>
              </button>
            </div>
          </div>
        ) : (
          /* Alternador Compacto de Tema quando Sidebar estiver recolhida */
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const proximoTema: Record<ModoTema, ModoTema> = {
                  sistema: 'claro',
                  claro: 'escuro',
                  escuro: 'sistema',
                };
                onAlterarTema(proximoTema[tema]);
              }}
              title={`Tema Atual: ${tema.toUpperCase()} (Clique para alternar Sistema → Claro → Escuro)`}
              className="w-10 h-10 rounded-xl bg-slate-900/60 dark:bg-slate-950 border border-slate-700/60 dark:border-slate-800 flex items-center justify-center text-slate-300 hover:text-[#E67E22] hover:border-[#E67E22]/40 transition-all cursor-pointer group"
            >
              {tema === 'sistema' && <Laptop className="w-4 h-4 text-orange-400 group-hover:scale-110" />}
              {tema === 'claro' && <Sun className="w-4 h-4 text-amber-400 group-hover:scale-110" />}
              {tema === 'escuro' && <Moon className="w-4 h-4 text-blue-400 group-hover:scale-110" />}
            </button>
          </div>
        )}
      </div>

      {/* Rodapé com Informações do Usuário & Logout */}
      <div className="p-3 border-t border-slate-700/60 dark:border-slate-800 bg-slate-800/40 dark:bg-slate-900/60">
        <div className={`flex items-center ${recolhida ? 'flex-col gap-2' : 'justify-between'}`}>
          <div
            className="flex items-center gap-2.5 overflow-hidden"
            title={recolhida && usuario ? `${usuario.nomeCompleto} (${usuario.perfil})` : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-[#E67E22] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-inner">
              {usuario ? usuario.nomeCompleto.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            {!recolhida && (
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">
                  {usuario ? usuario.nomeCompleto : 'Administrador'}
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                  {usuario ? usuario.perfil : 'ADMIN'}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            title="Encerrar Sessão (Logout)"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
