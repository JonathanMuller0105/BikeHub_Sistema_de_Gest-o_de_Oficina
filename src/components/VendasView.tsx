/**
 * ======================================================================
 * COMPONENTE: CATÁLOGO DE VENDAS DE SEMI-NOVAS & GESTÃO DE VENDAS (Dark/Light)
 * Localização: src/components/VendasView.tsx
 * ======================================================================
 */

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Check, 
  Tag, 
  Bike, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  DollarSign, 
  CreditCard, 
  QrCode,
  Plus,
  Pencil
} from 'lucide-react';
import { BicicletaCatalogo, Cliente, VendaRegistro } from '../types';
import { VendaModal } from './VendaModal';
import { NovaBicicletaModal } from './NovaBicicletaModal';

interface VendasViewProps {
  catalogo?: BicicletaCatalogo[];
  clientesCadastrados?: Cliente[];
  vendas?: VendaRegistro[];
  onRegistrarNovaVenda: (dados: Omit<VendaRegistro, 'id'>) => void;
  onCadastrarNovaBicicleta?: (novaBike: Omit<BicicletaCatalogo, 'id'>) => void;
  onAtualizarBicicleta?: (id: number, dados: Omit<BicicletaCatalogo, 'id'>) => void;
}

export const VendasView: React.FC<VendasViewProps> = ({
  catalogo = [],
  clientesCadastrados = [],
  vendas = [],
  onRegistrarNovaVenda,
  onCadastrarNovaBicicleta,
  onAtualizarBicicleta,
}) => {
  const [faixaFiltro, setFaixaFiltro] = useState<string>('TODAS');
  const [termo, setTermo] = useState('');
  const [abaExibicao, setAbaExibicao] = useState<'catalogo' | 'historico'>('catalogo');
  const [bikeParaVenda, setBikeParaVenda] = useState<BicicletaCatalogo | null>(null);
  const [mostrarModalNovaBike, setMostrarModalNovaBike] = useState(false);
  const [bikeEmEdicao, setBikeEmEdicao] = useState<BicicletaCatalogo | null>(null);

  const bicicletasVenda = catalogo.filter((b) => b.tipo === 'VENDA');

  const bicicletasFiltradas = bicicletasVenda.filter((b) => {
    const atendeFaixa = faixaFiltro === 'TODAS' || b.faixaEtaria === faixaFiltro;
    const atendeBusca =
      b.marca.toLowerCase().includes(termo.toLowerCase()) ||
      b.modelo.toLowerCase().includes(termo.toLowerCase()) ||
      b.cor.toLowerCase().includes(termo.toLowerCase()) ||
      b.descricao.toLowerCase().includes(termo.toLowerCase());
    return atendeFaixa && atendeBusca;
  });

  const faixas: { chave: string; label: string }[] = [
    { chave: 'TODAS', label: 'Todas as Faixas' },
    { chave: 'INFANTIL', label: 'Infantil' },
    { chave: 'JUVENIL', label: 'Juvenil' },
    { chave: 'ADULTO', label: 'Adulto' },
  ];

  const totalDisponiveis = bicicletasVenda.filter((b) => b.disponivel).length;
  const totalVendidas = bicicletasVenda.filter((b) => !b.disponivel).length;
  const faturamentoTotal = vendas.reduce((acc, curr) => acc + curr.valorFinal, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Catálogo de Bicicletas Semi-Novas
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Bicicletas inspecionadas e revisadas na bancada BikeHub com garantia mecânica de 6 meses
          </p>
        </div>

        {/* Ações do Topo */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setMostrarModalNovaBike(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Incluir Bike para Venda</span>
          </button>

          {/* Alternador de exibição */}
          <div className="flex items-center gap-1.5 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setAbaExibicao('catalogo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                abaExibicao === 'catalogo'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Estoque ({bicicletasVenda.length})
            </button>
            <button
              onClick={() => setAbaExibicao('historico')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                abaExibicao === 'historico'
                  ? 'bg-white dark:bg-slate-700 text-[#E67E22] shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Vendas Realizadas ({vendas.length})
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Estoque Disponível</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalDisponiveis} Semi-Novas</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total Vendidas</span>
            <p className="text-2xl font-black text-[#2C3E50] dark:text-white mt-1">{totalVendidas} Unidades</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#E67E22] flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Faturamento em Vendas</span>
            <p className="text-2xl font-black text-[#E67E22] mt-1">
              R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {abaExibicao === 'catalogo' ? (
        <>
          {/* Barra de Filtros e Busca */}
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

            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
                placeholder="Buscar por marca, modelo ou cor..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>

          {/* Grade de Cards do Catálogo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bicicletasFiltradas.map((bike) => {
              const badgeFaixa = {
                INFANTIL: 'bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-900/50',
                JUVENIL: 'bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-900/50',
                ADULTO: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50',
              }[bike.faixaEtaria];

              return (
                <div
                  key={bike.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
                    !bike.disponivel ? 'opacity-75 grayscale-[20%]' : ''
                  }`}
                >
                  <div>
                    <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <img
                        src={bike.imagemUrl}
                        alt={`${bike.marca} ${bike.modelo}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm ${badgeFaixa}`}>
                          {bike.faixaEtaria}
                        </span>
                        {bike.disponivel ? (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Disponível
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-700 dark:bg-slate-800 text-white shadow-sm">
                            Vendida
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500">
                          <span className="uppercase text-[#E67E22] tracking-wider">{bike.marca}</span>
                          <span>Ano {bike.ano}</span>
                        </div>
                        <h3 className="text-base font-black text-slate-800 dark:text-slate-100 leading-tight">
                          {bike.modelo}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {bike.descricao}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 pt-1">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">Cor:</span> {bike.cor}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Preço à Vista</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white">
                          R$ {bike.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        onClick={() => setBikeEmEdicao(bike)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors cursor-pointer"
                        title="Editar bicicleta"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      {bike.disponivel ? (
                        <button
                          onClick={() => setBikeParaVenda(bike)}
                          className="px-3.5 py-2 bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Registrar Venda</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed"
                        >
                          Vendido
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
           TABELA DE HISTÓRICO DE VENDAS & EMISSÃO DE RECIBO
           ==================================================================== */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100">Histórico de Vendas Concluídas</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Registros fiscais, termos de garantia de 6 meses e comprovantes</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Data Venda</th>
                  <th className="py-3 px-4">Comprador (CPF / Tel)</th>
                  <th className="py-3 px-4">Bicicleta Vendida</th>
                  <th className="py-3 px-4">Forma de Pagamento</th>
                  <th className="py-3 px-4">Valor Liquidado</th>
                  <th className="py-3 px-4">Garantia</th>
                  <th className="py-3 px-4 text-right">Comprovante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {vendas.map((venda) => (
                  <tr key={venda.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500 dark:text-slate-400">
                      {venda.dataVenda}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{venda.clienteNome}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">CPF: {venda.clienteCpf} • {venda.clienteTelefone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {venda.bicicletaDescricao}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                        {venda.formaPagamento} {venda.parcelas && venda.parcelas > 1 ? `(${venda.parcelas}x)` : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-600 dark:text-emerald-400 text-sm">
                      R$ {venda.valorFinal.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/50 px-2 py-0.5 rounded-md flex items-center gap-1 w-max">
                        <ShieldCheck className="w-3 h-3 text-[#E67E22]" /> {venda.garantiaMeses} Meses
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-lg text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                        title="Imprimir Recibo e Garantia"
                      >
                        <Printer className="w-3 h-3 text-orange-400" />
                        <span>Recibo</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================================
          MODAL DE REGISTRO DE VENDA (CHECKOUT PIX / CARTÕES)
         ====================================================================== */}
      {bikeParaVenda && (
        <VendaModal
          bike={bikeParaVenda}
          clientesCadastrados={clientesCadastrados}
          onFechar={() => setBikeParaVenda(null)}
          onConfirmarVenda={(dados) => {
            onRegistrarNovaVenda(dados);
            setBikeParaVenda(null);
          }}
        />
      )}

      {/* ======================================================================
          MODAL DE CADASTRO DE NOVA BICICLETA (SEMI-NOVA PARA VENDA)
         ====================================================================== */}
      {(mostrarModalNovaBike || bikeEmEdicao) && (
        <NovaBicicletaModal
          tipoInicial={bikeEmEdicao?.tipo ?? 'VENDA'}
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
