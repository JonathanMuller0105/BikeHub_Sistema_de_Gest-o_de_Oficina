/**
 * ======================================================================
 * COMPONENTE: FORMULÁRIO INTEGRADO DE CLIENTE E BICICLETA (Dark/Light)
 * Localização: src/components/ClienteFormView.tsx
 * ======================================================================
 */

import React, { useState } from 'react';
import { ArrowLeft, Save, User, Bike, Check } from 'lucide-react';
import { Cliente, Bicicleta, AbaNavegacao } from '../types';

interface ClienteFormViewProps {
  onSalvarClienteIntegrado: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>, bicicleta: Omit<Bicicleta, 'id' | 'clienteId'>) => void;
  onNavegar: (aba: AbaNavegacao) => void;
}

export const ClienteFormView: React.FC<ClienteFormViewProps> = ({
  onSalvarClienteIntegrado,
  onNavegar,
}) => {
  // Seção 1: Cliente
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');

  // Seção 2: Bicicleta
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [cor, setCor] = useState('');
  const [ano, setAno] = useState(2023);
  const [numeroSerie, setNumeroSerie] = useState('');

  const [erro, setErro] = useState('');

  // Máscara dinâmica de telefone brasileiro (XX) XXXXX-XXXX
  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (v.length > 0) {
      v = v.replace(/^(\d{0,2})$/, '($1');
    }
    setTelefone(v);
  };

  // Máscara dinâmica de CPF
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.length > 11) v = v.substring(0, 11);
    v = v.replace(/^(\d{3})(\d)/, '$1.$2');
    v = v.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    setCpf(v);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !telefone.trim() || !email.trim()) {
      setErro('Por favor, preencha os campos obrigatórios do cliente (Nome, Telefone e E-mail).');
      return;
    }

    if (!marca.trim() || !modelo.trim()) {
      setErro('Por favor, informe a Marca e o Modelo da bicicleta para completar o cadastro integrado.');
      return;
    }

    onSalvarClienteIntegrado(
      {
        nome,
        telefone,
        email,
        cpf: cpf || undefined,
        bicicletas: [],
      },
      {
        marca,
        modelo,
        cor: cor || 'Não especificada',
        ano: Number(ano) || 2023,
        numeroSerie: numeroSerie || undefined,
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Topbar */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => onNavegar('clientes')}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para Lista de Clientes</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Cadastro Integrado de Cliente e Bicicleta
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Cadastre os dados pessoais do proprietário e as especificações técnicas da bicicleta na mesma tela
          </p>
        </div>
      </div>

      {erro && (
        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-300 text-sm font-medium">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SEÇÃO 1: DADOS PESSOAIS */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E67E22] flex items-center justify-center font-black text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-[#E67E22]" /> Dados Pessoais do Cliente
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Informações de contato para emissão e notificação de OS</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Nome Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: Carlos Eduardo Silveira"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Telefone Celular / WhatsApp <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={telefone}
                onChange={handleTelefoneChange}
                required
                placeholder="(11) 98765-4321"
                maxLength={15}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Endereço de E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="cliente@email.com"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                CPF (Opcional)
              </label>
              <input
                type="text"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: DADOS DA BICICLETA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-[#E67E22] flex items-center justify-center font-black text-sm">
              2
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#E67E22]" /> Dados Técnicos da Bicicleta
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">Especificações do equipamento para abrir serviços de oficina</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Marca do Fabricante <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                required
                placeholder="Ex: Caloi, Trek, Specialized, Sense"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Modelo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                required
                placeholder="Ex: Explorer Pro 29, Marlin 7"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Cor Predominante
              </label>
              <input
                type="text"
                value={cor}
                onChange={(e) => setCor(e.target.value)}
                placeholder="Ex: Azul Metálico, Preto Fosco"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Ano de Fabricação
              </label>
              <input
                type="number"
                value={ano}
                onChange={(e) => setAno(Number(e.target.value))}
                min={1980}
                max={2030}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                Número de Série / Chassi (Quadro)
              </label>
              <input
                type="text"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                placeholder="Ex: SN-2023-88990 (gravado abaixo da caixa do movimento central)"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavegar('clientes')}
            className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Cadastro Integrado</span>
          </button>
        </div>
      </form>
    </div>
  );
};
