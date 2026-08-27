/**
 * ======================================================================
 * COMPONENTE: CATÁLOGO E TABELA DE SERVIÇOS PRESTADOS DA OFICINA
 * Localização: src/components/TabelaServicosView.tsx (Dark/Light)
 * ======================================================================
 */

import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  Tag, 
  Layers, 
  Sparkles, 
  Trash2, 
  Edit3, 
  ArrowRight,
  ShieldCheck,
  Check,
  X
} from 'lucide-react';
import { ServicoCatalogo, CategoriaServico, AbaNavegacao } from '../types';

interface TabelaServicosViewProps {
  servicosCatalogo?: ServicoCatalogo[];
  servicos?: ServicoCatalogo[];
  onSalvarServico: (servico: Omit<ServicoCatalogo, 'id'> | ServicoCatalogo) => void;
  onAlternarStatusServico?: (id: number) => void;
  onAlternarStatus?: (id: number) => void;
  onExcluirServico: (id: number) => void;
  onNavegar?: (aba: AbaNavegacao) => void;
}

export const TabelaServicosView: React.FC<TabelaServicosViewProps> = ({
  servicosCatalogo = [],
  servicos,
  onSalvarServico,
  onAlternarStatusServico,
  onAlternarStatus,
  onExcluirServico,
  onNavegar,
}) => {
  const listaServicos = servicosCatalogo && servicosCatalogo.length > 0 
    ? servicosCatalogo 
    : (servicos || []);
  const alternarStatus = onAlternarStatusServico || onAlternarStatus || (() => {});
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODAS');
  const [termoBusca, setTermoBusca] = useState('');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [servicoEmEdicao, setServicoEmEdicao] = useState<ServicoCatalogo | null>(null);

  // Form State para Novo Serviço
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<CategoriaServico>('REVISAO');
  const [valor, setValor] = useState('');
  const [tempoEstimado, setTempoEstimado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [incluiPecas, setIncluiPecas] = useState(false);
  const [erroForm, setErroForm] = useState('');

  const categorias: { chave: string; label: string }[] = [
    { chave: 'TODAS', label: 'Todas as Categorias' },
    { chave: 'REVISAO', label: 'Revisões Gerais' },
    { chave: 'FREIOS', label: 'Freios & Sangria' },
    { chave: 'TRANSMISSAO', label: 'Transmissão & Câmbios' },
    { chave: 'SUSPENSAO', label: 'Suspensão & Shocks' },
    { chave: 'RODAS_PNEUS', label: 'Rodas & Tubeless' },
    { chave: 'LAVAGEM', label: 'Lavagem & Estética' },
    { chave: 'AJUSTES', label: 'Bike Fit & Ajustes' },
  ];

  const servicosFiltrados = listaServicos.filter((s) => {
    const atendeCategoria = categoriaFiltro === 'TODAS' || s.categoria === categoriaFiltro;
    const atendeBusca = 
      s.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
      s.descricao.toLowerCase().includes(termoBusca.toLowerCase()) ||
      s.tempoEstimado.toLowerCase().includes(termoBusca.toLowerCase());
    return atendeCategoria && atendeBusca;
  });

  const getBadgeCategoria = (cat: CategoriaServico) => {
    switch (cat) {
      case 'REVISAO':
        return 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-900/50';
      case 'FREIOS':
        return 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border-red-200 dark:border-red-900/50';
      case 'TRANSMISSAO':
        return 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/50';
      case 'SUSPENSAO':
        return 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900/50';
      case 'RODAS_PNEUS':
        return 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-900/50';
      case 'LAVAGEM':
        return 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-900/50';
      case 'AJUSTES':
        return 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700';
    }
  };

  const limparFormulario = () => {
    setNome('');
    setCategoria('REVISAO');
    setValor('');
    setTempoEstimado('');
    setDescricao('');
    setIncluiPecas(false);
    setErroForm('');
    setServicoEmEdicao(null);
  };

  const fecharModal = () => {
    setModalNovoAberto(false);
    limparFormulario();
  };

  const abrirCadastro = () => {
    limparFormulario();
    setModalNovoAberto(true);
  };

  const abrirEdicao = (servico: ServicoCatalogo) => {
    setServicoEmEdicao(servico);
    setNome(servico.nome);
    setCategoria(servico.categoria);
    setValor(String(servico.valor));
    setTempoEstimado(servico.tempoEstimado);
    setDescricao(servico.descricao);
    setIncluiPecas(servico.incluiPecas);
    setErroForm('');
    setModalNovoAberto(true);
  };

  const handleSubmeterServico = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      setErroForm('Informe o nome do serviço.');
      return;
    }
    if (!valor || Number(valor) <= 0) {
      setErroForm('Informe um valor válido em R$.');
      return;
    }
    if (!tempoEstimado.trim()) {
      setErroForm('Informe o tempo médio estimado.');
      return;
    }
    if (!descricao.trim()) {
      setErroForm('Descreva os procedimentos executados no serviço.');
      return;
    }

    const dadosServico = {
      nome: nome.trim(),
      categoria,
      valor: Number(valor),
      tempoEstimado: tempoEstimado.trim(),
      descricao: descricao.trim(),
      ativo: servicoEmEdicao?.ativo ?? true,
      incluiPecas,
    };

    onSalvarServico(servicoEmEdicao
      ? { ...dadosServico, id: servicoEmEdicao.id }
      : dadosServico);

    fecharModal();
  };

  const totalAtivos = listaServicos.filter((s) => s.ativo).length;
  const valorMedio = listaServicos.length > 0 
    ? listaServicos.reduce((acc, curr) => acc + curr.valor, 0) / listaServicos.length 
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Tabela de Serviços Prestados
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Catálogo oficial de mão de obra técnica, revisões e procedimentos mecânicos BikeHub
          </p>
        </div>
        <div className="flex items-center gap-3">
          {onNavegar && (
            <button
              onClick={() => onNavegar('servico-novo')}
              className="px-4 py-2.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wrench className="w-4 h-4 text-[#E67E22]" />
              <span>Abrir Nova OS</span>
            </button>
          )}
          <button
            onClick={abrirCadastro}
            className="px-4 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Cadastrar Novo Serviço</span>
          </button>
        </div>
      </div>

      {/* Cards de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total de Procedimentos</span>
            <p className="text-2xl font-black text-[#2C3E50] dark:text-white mt-1">{listaServicos.length} Serviços</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#E67E22] flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Serviços Ativos em Tabela</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{totalAtivos} Disponíveis</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Ticket Médio de Mão de Obra</span>
            <p className="text-2xl font-black text-[#2C3E50] dark:text-white mt-1">
              R$ {valorMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Pílulas de Categoria */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categorias.map((c) => (
            <button
              key={c.chave}
              onClick={() => setCategoriaFiltro(c.chave)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                categoriaFiltro === c.chave
                  ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            placeholder="Buscar por nome, tempo ou peças..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {servicosFiltrados.map((item) => {
          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md ${
                !item.ativo 
                  ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-800/30' 
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Topo do Card: Categoria & Status */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${getBadgeCategoria(item.categoria)}`}>
                    {item.categoria.replace('_', ' ')}
                  </span>
                  <button
                    onClick={() => alternarStatus(item.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 cursor-pointer transition-colors ${
                      item.ativo 
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                    title="Clique para alternar disponibilidade"
                  >
                    {item.ativo ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>{item.ativo ? 'Ativo na Tabela' : 'Inativo'}</span>
                  </button>
                </div>

                {/* Título e Descrição */}
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {item.nome}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.descricao}
                </p>

                {/* Insumos inclusos */}
                {item.incluiPecas && (
                  <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900/50">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Insumos & Fluidos Inclusos</span>
                  </div>
                )}
              </div>

              {/* Rodapé: Tempo Estimado, Preço e Ações */}
              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{item.tempoEstimado}</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => abrirEdicao(item)}
                    className="p-2 text-slate-400 hover:text-[#E67E22] hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-xl transition-colors cursor-pointer"
                    title="Editar serviço"
                    aria-label={`Editar serviço ${item.nome}`}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Deseja remover o serviço "${item.nome}" da tabela oficial?`)) {
                        onExcluirServico(item.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
                    title="Excluir serviço"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {onNavegar && (
                    <button
                      onClick={() => onNavegar('servico-novo')}
                      className="px-3 py-1.5 bg-orange-50 dark:bg-orange-950/50 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-[#E67E22] border border-orange-200 dark:border-orange-800 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Abrir OS para este serviço"
                    >
                      <span>Lançar OS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {servicosFiltrados.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          <Wrench className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="font-bold text-slate-700 dark:text-slate-300">Nenhum serviço encontrado</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Tente ajustar a categoria selecionada ou o termo de busca</p>
        </div>
      )}

      {/* ======================================================================
          MODAL DE CADASTRO DE NOVO SERVIÇO DE OFICINA
         ====================================================================== */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn">
            {/* Header do Modal */}
            <div className="p-6 bg-gradient-to-r from-[#2C3E50] to-[#1E293B] dark:from-slate-900 dark:to-slate-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center font-bold shadow-md">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">
                    {servicoEmEdicao ? 'Editar Serviço de Oficina' : 'Cadastrar Novo Serviço de Oficina'}
                  </h2>
                  <p className="text-xs text-slate-300">
                    {servicoEmEdicao
                      ? 'Atualize os dados do procedimento selecionado'
                      : 'Inclua o procedimento na tabela de preços e catálogo oficial'}
                  </p>
                </div>
              </div>
              <button
                onClick={fecharModal}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Formulário */}
            <form onSubmit={handleSubmeterServico} className="p-6 space-y-4">
              {erroForm && (
                <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold">
                  {erroForm}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome do Serviço / Procedimento Técnico <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Sangria e Regulagem de Freios SRAM Code"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Categoria da Manutenção <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as CategoriaServico)}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900 cursor-pointer"
                  >
                    <option value="REVISAO" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Revisões Gerais</option>
                    <option value="FREIOS" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Freios & Sangria</option>
                    <option value="TRANSMISSAO" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Transmissão & Câmbios</option>
                    <option value="SUSPENSAO" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Suspensão & Shocks</option>
                    <option value="RODAS_PNEUS" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Rodas & Tubeless</option>
                    <option value="LAVAGEM" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Lavagem & Estética</option>
                    <option value="AJUSTES" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">Bike Fit & Ajustes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Valor de Tabela (R$) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">R$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={valor}
                      onChange={(e) => setValor(e.target.value)}
                      placeholder="180.00"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Tempo Médio de Execução <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={tempoEstimado}
                  onChange={(e) => setTempoEstimado(e.target.value)}
                  placeholder="Ex: 1 hora e 30 minutos"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Descrição dos Procedimentos Mecânicos <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  placeholder="Detalhe o que é feito na bancada mecânica, ferramentas usadas e garantias..."
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="incluiPecasCheck"
                  checked={incluiPecas}
                  onChange={(e) => setIncluiPecas(e.target.checked)}
                  className="w-4 h-4 text-[#E67E22] rounded border-slate-300 dark:border-slate-600 focus:ring-[#E67E22] cursor-pointer"
                />
                <label htmlFor="incluiPecasCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  Este serviço já inclui insumos básicos / fluidos / lubrificantes
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  {servicoEmEdicao ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{servicoEmEdicao ? 'Salvar Alterações' : 'Cadastrar Serviço'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
