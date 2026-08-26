/**
 * ======================================================================
 * COMPONENTE: BARRA SUPERIOR DO SISTEMA (TOP HEADER)
 * Localização: src/components/TopHeader.tsx
 * ======================================================================
 * Recursos:
 * - Botão de recolhimento / expansão rápida do menu lateral
 * - Indicador de navegação e status da aplicação
 * - Seletor rápido de tema (Sistema, Claro, Escuro)
 * - Atalhos rápidos para contadores e abertura de OS
 */

import React from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Sun, 
  Moon, 
  Laptop, 
  Wrench, 
  Bike,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { AbaNavegacao, ModoTema, Usuario } from '../types';

interface TopHeaderProps {
  abaAtiva: AbaNavegacao;
  sidebarRecolhida: boolean;
  onAlternarSidebar: () => void;
  tema: ModoTema;
  onAlterarTema: (tema: ModoTema) => void;
  escuroEfetivo: boolean;
  usuario: Usuario | null;
  quantidadeOS: number;
}

const ROTULOS_ABAS: Record<AbaNavegacao, string> = {
  dashboard: 'Painel Geral da Oficina',
  clientes: 'Gestão de Clientes & Bicicletas',
  'cliente-novo': 'Cadastro de Novo Cliente & Bike',
  servicos: 'Ordens de Serviço (Bancada Mecânica)',
  'servico-novo': 'Abertura de Nova Ordem de Serviço',
  'tabela-servicos': 'Tabela de Mão de Obra e Serviços',
  vendas: 'Catálogo de Bicicletas Semi-Novas',
  aluguel: 'Frota de Locação e Aluguel',
  usuarios: 'Equipe e Controle de Acesso',
  'codigo-spring': 'Visualizador Spring Boot 3 & JPA',
};

export const TopHeader: React.FC<TopHeaderProps> = ({
  abaAtiva,
  sidebarRecolhida,
  onAlternarSidebar,
  tema,
  onAlterarTema,
  escuroEfetivo,
  usuario,
  quantidadeOS,
}) => {
  return (
    <header className="mb-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
      {/* Lado Esquerdo: Toggle Sidebar + Título da Aba */}
      <div className="flex items-center gap-3">
        <button
          onClick={onAlternarSidebar}
          title={sidebarRecolhida ? 'Expandir Menu Lateral' : 'Recolher Menu Lateral'}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold shrink-0"
        >
          {sidebarRecolhida ? (
            <>
              <PanelLeftOpen className="w-4 h-4 text-[#E67E22]" />
              <span className="hidden md:inline">Expandir Menu</span>
            </>
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="hidden md:inline">Recolher Menu</span>
            </>
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div className="overflow-hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E67E22] bg-orange-50 dark:bg-orange-950/50 px-2 py-0.5 rounded-md border border-orange-200/60 dark:border-orange-800/40">
              BikeHub OS
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">•</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
              Módulo Ativo
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 truncate">
            {ROTULOS_ABAS[abaAtiva] || 'Painel'}
          </h2>
        </div>
      </div>

      {/* Lado Direito: Seletor de Tema e Indicadores Rápidos */}
      <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 self-end sm:self-auto">
        {/* Indicador de OS em bancada */}
        {quantidadeOS > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300">
            <Wrench className="w-3.5 h-3.5 text-[#E67E22]" />
            <span>{quantidadeOS} OS na bancada</span>
          </div>
        )}

        {/* Seletor de Tema (Segmented Pill) */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => onAlterarTema('sistema')}
            title={`Tema do Sistema (${escuroEfetivo ? 'Escuro' : 'Claro'} ativo pelo OS)`}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              tema === 'sistema'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Laptop className={`w-3.5 h-3.5 ${tema === 'sistema' ? 'text-[#E67E22]' : ''}`} />
            <span className="hidden sm:inline">Sistema</span>
          </button>

          <button
            type="button"
            onClick={() => onAlterarTema('claro')}
            title="Tema Claro"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              tema === 'claro'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className={`w-3.5 h-3.5 ${tema === 'claro' ? 'text-amber-500' : ''}`} />
            <span className="hidden sm:inline">Claro</span>
          </button>

          <button
            type="button"
            onClick={() => onAlterarTema('escuro')}
            title="Tema Escuro"
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              tema === 'escuro'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className={`w-3.5 h-3.5 ${tema === 'escuro' ? 'text-blue-400' : ''}`} />
            <span className="hidden sm:inline">Escuro</span>
          </button>
        </div>
      </div>
    </header>
  );
};
