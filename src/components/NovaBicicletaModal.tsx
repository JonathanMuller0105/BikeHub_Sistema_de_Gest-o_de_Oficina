/**
 * ======================================================================
 * COMPONENTE: MODAL DE CADASTRO DE NOVA BICICLETA (ALUGUEL OU VENDA)
 * Localização: src/components/NovaBicicletaModal.tsx
 * ======================================================================
 * Recursos:
 * - Alternância intuitiva entre Frota de Aluguel (Locação) e Catálogo de Vendas (Semi-Novas)
 * - Seleção ágil de marcas consagradas (Caloi, Trek, Specialized, Sense, Oggi, Scott, etc.)
 * - Galeria de imagens pré-configuradas em alta definição para escolha rápida em 1 clique
 * - Geração automática de número de série / chassi
 * - Gerador inteligente de descrição e ficha técnica mecânica
 */

import React, { useState } from 'react';
import { 
  Bike, 
  X, 
  Check, 
  Sparkles, 
  DollarSign, 
  Tag, 
  CalendarClock, 
  ShoppingBag, 
  Image as ImageIcon,
  Wrench,
  Layers,
  Palette,
  Hash
} from 'lucide-react';
import { BicicletaCatalogo, FaixaEtaria, TipoCatalogo } from '../types';

interface NovaBicicletaModalProps {
  tipoInicial?: TipoCatalogo;
  onFechar: () => void;
  onSalvarBicicleta: (novaBike: Omit<BicicletaCatalogo, 'id'>) => void;
}

// Galeria de fotos de alta qualidade para bicicletas
const IMAGENS_PREDEFINIDAS = [
  {
    nome: 'Mountain Bike Grafite / Laranja (Trilha & Urbano)',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    faixaEtaria: 'ADULTO' as FaixaEtaria,
  },
  {
    nome: 'MTB Hardtail Azul Metálico (Trilhas Leves & Passeio)',
    url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80',
    faixaEtaria: 'ADULTO' as FaixaEtaria,
  },
  {
    nome: 'Bicicleta Urbana Retrô / Vintage Creme (Passeios na Orla)',
    url: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=800&q=80',
    faixaEtaria: 'ADULTO' as FaixaEtaria,
  },
  {
    nome: 'Bicicleta Infantil Vermelha Racing (Aro 16/20 com Rodinhas)',
    url: 'https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=800&q=80',
    faixaEtaria: 'INFANTIL' as FaixaEtaria,
  },
  {
    nome: 'Speed / Road Bike Preta Fosca (Alta Performance no Asfalto)',
    url: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80',
    faixaEtaria: 'ADULTO' as FaixaEtaria,
  },
  {
    nome: 'Bicicleta Juvenil Verde Neon (Aro 24 - Recreação)',
    url: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80',
    faixaEtaria: 'JUVENIL' as FaixaEtaria,
  }
];

const MARCAS_SUGERIDAS = ['Caloi', 'Specialized', 'Trek', 'Sense', 'Oggi', 'Cannondale', 'Scott', 'Audax', 'Monark'];

export const NovaBicicletaModal: React.FC<NovaBicicletaModalProps> = ({
  tipoInicial = 'ALUGUEL',
  onFechar,
  onSalvarBicicleta,
}) => {
  const [tipo, setTipo] = useState<TipoCatalogo>(tipoInicial);
  const [marca, setMarca] = useState('Sense');
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [cor, setCor] = useState('Preto Fosco com Grafite');
  const [faixaEtaria, setFaixaEtaria] = useState<FaixaEtaria>('ADULTO');
  const [valor, setValor] = useState<number>(tipoInicial === 'ALUGUEL' ? 65.00 : 2800.00);
  const [numeroSerie, setNumeroSerie] = useState(() => `SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const [imagemUrl, setImagemUrl] = useState(IMAGENS_PREDEFINIDAS[0].url);
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');

  // Ao alternar o tipo (Aluguel vs Venda), ajusta valor sugerido padrão
  const handleAlternarTipo = (novoTipo: TipoCatalogo) => {
    setTipo(novoTipo);
    if (novoTipo === 'ALUGUEL' && valor > 300) {
      setValor(65.00);
    } else if (novoTipo === 'VENDA' && valor < 300) {
      setValor(2850.00);
    }
  };

  const gerarDescricaoAutomatica = () => {
    if (!marca || !modelo) {
      setErro('Preencha ao menos a marca e o modelo para gerar a descrição automática.');
      return;
    }
    const finalidade = tipo === 'ALUGUEL' 
      ? 'Excelente para locações de fim de semana, passeios em ciclovias e trilhas urbanas. Revisada periodicamente na oficina BikeHub com kit de segurança completo.'
      : 'Bicicleta semi-nova em estado impecável, 100% revisada com laudo técnico e garantia mecânica BikeHub de 6 meses no quadro e componentes.';
    
    setDescricao(`${marca} ${modelo} (${ano}) - Cor ${cor}. Equipada com transmissão moderna, freios de alta eficiência e quadro em alumínio leve. ${finalidade}`);
    setErro('');
  };

  const handleSalvar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marca.trim()) {
      setErro('Informe a marca da bicicleta.');
      return;
    }
    if (!modelo.trim()) {
      setErro('Informe o modelo da bicicleta.');
      return;
    }
    if (valor <= 0) {
      setErro('O valor deve ser maior que zero.');
      return;
    }
    if (!imagemUrl.trim()) {
      setErro('Selecione ou informe uma URL de imagem válida para a bicicleta.');
      return;
    }

    onSalvarBicicleta({
      marca: marca.trim(),
      modelo: modelo.trim(),
      ano: Number(ano),
      cor: cor.trim(),
      faixaEtaria,
      tipo,
      valor: Number(valor),
      descricao: descricao.trim() || `${marca} ${modelo} ${ano} - Cor ${cor}. Pronta para uso.`,
      imagemUrl: imagemUrl.trim(),
      disponivel: true,
      numeroSerie: numeroSerie.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#2C3E50] to-[#1E293B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/20">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Novo Cadastro
                </span>
                <span className="text-xs text-slate-300 font-medium">Catálogo BikeHub</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {tipo === 'ALUGUEL' ? 'Incluir Bicicleta na Frota de Aluguel' : 'Cadastrar Bicicleta Semi-Nova para Venda'}
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

        {/* Formulário Scrollável */}
        <form onSubmit={handleSalvar} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {erro && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>{erro}</span>
            </div>
          )}

          {/* Seleção do Tipo / Destino */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Destino no Sistema <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleAlternarTipo('ALUGUEL')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  tipo === 'ALUGUEL'
                    ? 'bg-orange-50 border-[#E67E22] text-[#E67E22] shadow-sm font-bold ring-2 ring-[#E67E22]/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                  <CalendarClock className="w-4 h-4 text-[#E67E22]" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Frota de Aluguel</p>
                  <p className="text-[10px] text-slate-400">Cobrança por diária e locação</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleAlternarTipo('VENDA')}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                  tipo === 'VENDA'
                    ? 'bg-blue-50 border-blue-600 text-blue-600 shadow-sm font-bold ring-2 ring-blue-600/20'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold">Venda Semi-Nova</p>
                  <p className="text-[10px] text-slate-400">Estoque de venda com garantia</p>
                </div>
              </button>
            </div>
          </div>

          {/* Dados Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Marca */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Marca Fabricante <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ex: Sense, Trek, Caloi, Specialized"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
              {/* Chips rápidos de marcas */}
              <div className="flex flex-wrap gap-1 pt-1">
                {MARCAS_SUGERIDAS.slice(0, 6).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMarca(m)}
                    className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md transition-colors cursor-pointer"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Modelo */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Modelo da Bicicleta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ex: Rockhopper Comp 29 / Explorer Pro"
                required
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>

            {/* Ano */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Ano de Fabricação
              </label>
              <input
                type="number"
                min="2015"
                max="2030"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>

            {/* Cor Predominante */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Cor Predominante
              </label>
              <input
                type="text"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                placeholder="Ex: Azul Metálico / Preto Fosco"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>

            {/* Faixa Etária / Categoria */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Faixa Etária / Categoria
              </label>
              <select
                value={faixaEtaria}
                onChange={(e) => setFaixaEtaria(e.target.value as FaixaEtaria)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#E67E22] cursor-pointer"
              >
                <option value="ADULTO">Adulto (Aros 26, 27.5 ou 29)</option>
                <option value="JUVENIL">Juvenil (Aro 24)</option>
                <option value="INFANTIL">Infantil (Aros 12, 16 ou 20)</option>
              </select>
            </div>

            {/* Valor (Diária ou Preço de Venda) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {tipo === 'ALUGUEL' ? 'Valor da Diária (R$ / dia)' : 'Preço de Venda (R$)'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">R$</span>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={valor}
                  onChange={(e) => setValor(Number(e.target.value))}
                  required
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
                />
              </div>
            </div>

            {/* Número de Série */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Número de Chassi / Série do Quadro (Opcional)
                </label>
                <button
                  type="button"
                  onClick={() => setNumeroSerie(`SN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`)}
                  className="text-[10px] font-bold text-[#E67E22] hover:underline cursor-pointer"
                >
                  + Gerar Código Aleatório
                </button>
              </div>
              <input
                type="text"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                placeholder="Ex: SN-A98B23C"
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
              />
            </div>
          </div>

          {/* Galeria de Fotos e URL da Imagem */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Foto da Bicicleta (Escolha Rápida ou URL Personalizada)
              </label>
              <span className="text-[10px] text-slate-400">Alta resolução</span>
            </div>

            {/* Miniaturas de escolha rápida */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {IMAGENS_PREDEFINIDAS.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setImagemUrl(img.url);
                    setFaixaEtaria(img.faixaEtaria);
                  }}
                  className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                    imagemUrl === img.url ? 'border-[#E67E22] ring-2 ring-[#E67E22]/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  title={img.nome}
                >
                  <img
                    src={img.url}
                    alt={img.nome}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {imagemUrl === img.url && (
                    <div className="absolute inset-0 bg-orange-600/30 flex items-center justify-center">
                      <Check className="w-4 h-4 text-white drop-shadow-md" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="url"
              value={imagemUrl}
              onChange={(e) => setImagemUrl(e.target.value)}
              placeholder="https://exemplo.com/foto-da-bicicleta.jpg"
              className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          {/* Descrição e Ficha Técnica */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Descrição Técnica & Detalhes da Bicicleta
              </label>
              <button
                type="button"
                onClick={gerarDescricaoAutomatica}
                className="text-[11px] font-bold text-[#E67E22] hover:text-[#D35400] flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gerar Ficha Automática</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva os componentes, suspensão, freios, estado dos pneus e acessórios inclusos..."
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
            />
          </div>

          {/* Rodapé de Ações */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar no Catálogo BikeHub</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
