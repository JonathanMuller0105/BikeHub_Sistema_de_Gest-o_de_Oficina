/**
 * ======================================================================
 * COMPONENTE: GESTÃO E CADASTRO DE USUÁRIOS E FUNCIONÁRIOS (Dark/Light)
 * Localização: src/components/UsuariosView.tsx
 * ======================================================================
 */

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Wrench, 
  ShoppingBag, 
  Check, 
  X, 
  Lock, 
  Mail, 
  Phone, 
  Briefcase, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Pencil
} from 'lucide-react';
import { Usuario, PerfilUsuario } from '../types';

interface UsuariosViewProps {
  usuarios?: Usuario[];
  onSalvarUsuario: (usuario: Omit<Usuario, 'id'> | Usuario) => void;
  onAlternarStatusUsuario?: (id: number) => void;
  onAlternarStatus?: (id: number) => void;
  onExcluirUsuario: (id: number) => void;
}

export const UsuariosView: React.FC<UsuariosViewProps> = ({
  usuarios = [],
  onSalvarUsuario,
  onAlternarStatusUsuario,
  onAlternarStatus,
  onExcluirUsuario,
}) => {
  const alternarStatus = onAlternarStatusUsuario || onAlternarStatus || (() => {});
  const listaUsuarios = usuarios || [];
  const [filtroPerfil, setFiltroPerfil] = useState<string>('TODOS');
  const [termoBusca, setTermoBusca] = useState('');
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [usuarioEmEdicao, setUsuarioEmEdicao] = useState<Usuario | null>(null);

  // Form State
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario>('MECANICO');
  const [senha, setSenha] = useState('');
  const [confirmacaoSenha, setConfirmacaoSenha] = useState('');
  const [erroForm, setErroForm] = useState('');

  const usuariosFiltrados = listaUsuarios.filter((u) => {
    const atendePerfil = filtroPerfil === 'TODOS' || u.perfil === filtroPerfil;
    const atendeBusca = 
      u.nomeCompleto.toLowerCase().includes(termoBusca.toLowerCase()) ||
      u.login.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (u.cargo && u.cargo.toLowerCase().includes(termoBusca.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(termoBusca.toLowerCase()));
    return atendePerfil && atendeBusca;
  });

  const getBadgePerfil = (p: PerfilUsuario) => {
    switch (p) {
      case 'ADMIN':
        return {
          label: 'Administrador Geral',
          badge: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-900/50',
          icon: ShieldCheck,
        };
      case 'MECANICO':
        return {
          label: 'Mecânico Técnico',
          badge: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-900/50',
          icon: Wrench,
        };
      case 'ATENDENTE':
        return {
          label: 'Consultor / Atendente',
          badge: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-900/50',
          icon: ShoppingBag,
        };
      default:
        return {
          label: p,
          badge: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          icon: Users,
        };
    }
  };

  const handleSubmeterNovoUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto.trim()) {
      setErroForm('Informe o nome completo do colaborador.');
      return;
    }
    if (!login.trim()) {
      setErroForm('Informe o login/usuário de acesso.');
      return;
    }
    if (usuarios.some((u) => u.id !== usuarioEmEdicao?.id && u.login.toLowerCase() === login.trim().toLowerCase())) {
      setErroForm('Este login de acesso já está em uso por outro funcionário.');
      return;
    }
    if (!cargo.trim()) {
      setErroForm('Informe o cargo ou especialidade.');
      return;
    }
    if (!usuarioEmEdicao && !senha) {
      setErroForm('Digite a senha inicial de acesso.');
      return;
    }
    if (senha && senha.length < 4) {
      setErroForm('A senha deve conter no mínimo 4 caracteres.');
      return;
    }
    if (senha !== confirmacaoSenha) {
      setErroForm('As senhas digitadas não coincidem.');
      return;
    }

    onSalvarUsuario({
      ...(usuarioEmEdicao ? { id: usuarioEmEdicao.id } : {}),
      nomeCompleto: nomeCompleto.trim(),
      login: login.trim(),
      senha: senha || undefined,
      email: email.trim() || `${login.trim().toLowerCase()}@bikehub.com.br`,
      telefone: telefone.trim() || '(11) 98000-0000',
      cargo: cargo.trim(),
      perfil,
      ativo: usuarioEmEdicao?.ativo ?? true,
      dataCadastro: usuarioEmEdicao?.dataCadastro ?? new Date().toISOString().split('T')[0],
    });

    // Limpar form
    setNomeCompleto('');
    setLogin('');
    setEmail('');
    setTelefone('');
    setCargo('');
    setPerfil('MECANICO');
    setSenha('');
    setConfirmacaoSenha('');
    setErroForm('');
    setModalNovoAberto(false);
    setUsuarioEmEdicao(null);
  };

  const abrirNovoUsuario = () => {
    setUsuarioEmEdicao(null);
    setNomeCompleto(''); setLogin(''); setEmail(''); setTelefone(''); setCargo('');
    setPerfil('MECANICO'); setSenha(''); setConfirmacaoSenha(''); setErroForm('');
    setModalNovoAberto(true);
  };

  const abrirEdicaoUsuario = (usuario: Usuario) => {
    setUsuarioEmEdicao(usuario);
    setNomeCompleto(usuario.nomeCompleto);
    setLogin(usuario.login);
    setEmail(usuario.email ?? '');
    setTelefone(usuario.telefone ?? '');
    setCargo(usuario.cargo ?? '');
    setPerfil(usuario.perfil);
    setSenha(''); setConfirmacaoSenha(''); setErroForm('');
    setModalNovoAberto(true);
  };

  const fecharModal = () => {
    setModalNovoAberto(false);
    setUsuarioEmEdicao(null);
    setErroForm('');
  };

  const totalAdmins = listaUsuarios.filter((u) => u.perfil === 'ADMIN').length;
  const totalMecanicos = listaUsuarios.filter((u) => u.perfil === 'MECANICO').length;
  const totalAtendentes = listaUsuarios.filter((u) => u.perfil === 'ATENDENTE').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C3E50] dark:text-white tracking-tight">
            Usuários & Funcionários da Oficina
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão de equipe técnica, credenciais de acesso e permissões no sistema BikeHub
          </p>
        </div>
        <button
          onClick={abrirNovoUsuario}
          className="px-4 py-2.5 bg-[#E67E22] hover:bg-[#D35400] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ Cadastrar Novo Funcionário</span>
        </button>
      </div>

      {/* Métricas de Perfis */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Total na Equipe</span>
            <p className="text-2xl font-black text-[#2C3E50] dark:text-white mt-1">{usuarios.length} Usuários</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Administradores</span>
            <p className="text-2xl font-black text-purple-700 dark:text-purple-400 mt-1">{totalAdmins} Admins</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Mecânicos de Bancada</span>
            <p className="text-2xl font-black text-[#E67E22] mt-1">{totalMecanicos} Mecânicos</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-[#E67E22] flex items-center justify-center font-bold">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Atendentes & Balcão</span>
            <p className="text-2xl font-black text-blue-700 dark:text-blue-400 mt-1">{totalAtendentes} Atendentes</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Pílulas de Perfil */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { chave: 'TODOS', label: 'Todos os Perfis' },
            { chave: 'ADMIN', label: 'Administradores' },
            { chave: 'MECANICO', label: 'Mecânicos' },
            { chave: 'ATENDENTE', label: 'Atendimento & Caixa' },
          ].map((f) => (
            <button
              key={f.chave}
              onClick={() => setFiltroPerfil(f.chave)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filtroPerfil === f.chave
                  ? 'bg-[#E67E22] text-white shadow-md shadow-orange-500/25'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f.label}
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
            placeholder="Buscar por nome, login ou cargo..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Grid de Usuários / Funcionários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {usuariosFiltrados.map((u) => {
          const { label, badge, icon: IconPerfil } = getBadgePerfil(u.perfil);
          const isAtivo = u.ativo !== false;

          return (
            <div
              key={u.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md ${
                !isAtivo 
                  ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50/50 dark:bg-slate-900/50' 
                  : 'border-slate-200/80 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header do Card com Avatar e Status */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center font-black text-base shadow-sm">
                      {u.nomeCompleto.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">{u.nomeCompleto}</h3>
                      <span className="text-xs font-mono text-slate-400 dark:text-slate-500">@{u.login}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alternarStatus(u.id)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 cursor-pointer transition-colors ${
                      isAtivo
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                    title="Alternar status do usuário"
                  >
                    {isAtivo ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <X className="w-3 h-3 text-slate-400" />}
                    <span>{isAtivo ? 'Ativo' : 'Inativo'}</span>
                  </button>
                </div>

                {/* Perfil & Cargo */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge}`}>
                      <IconPerfil className="w-3 h-3" />
                      <span>{label}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <Briefcase className="w-3.5 h-3.5 text-[#E67E22]" />
                    <span>{u.cargo || 'Funcionário Técnico'}</span>
                  </div>
                </div>

                {/* Contatos */}
                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{u.email || `${u.login}@bikehub.com.br`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.telefone || '(11) 98765-4321'}</span>
                  </div>
                </div>
              </div>

              {/* Rodapé: Ações */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Cadastrado em {u.dataCadastro || '2026-08-01'}
                </span>
                <button
                  onClick={() => abrirEdicaoUsuario(u)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl transition-colors cursor-pointer"
                  title="Editar usuário"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                
                {usuarios.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Deseja realmente remover o usuário "${u.nomeCompleto}"?`)) {
                        onExcluirUsuario(u.id);
                      }
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-xl transition-colors cursor-pointer"
                    title="Excluir usuário"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {usuariosFiltrados.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
          <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
          <p className="font-bold text-slate-700 dark:text-slate-300">Nenhum funcionário encontrado</p>
          <p className="text-xs text-slate-400 mt-1">Tente ajustar o perfil filtrado ou a busca</p>
        </div>
      )}

      {/* ======================================================================
          MODAL DE CADASTRO DE NOVO FUNCIONÁRIO / USUÁRIO
         ====================================================================== */}
      {modalNovoAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fadeIn">
            {/* Header do Modal */}
            <div className="p-6 bg-gradient-to-r from-[#2C3E50] to-[#1E293B] dark:from-slate-950 dark:to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E67E22] text-white flex items-center justify-center font-bold shadow-md">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">{usuarioEmEdicao ? `Editar Colaborador #${usuarioEmEdicao.id}` : 'Cadastrar Novo Colaborador'}</h2>
                  <p className="text-xs text-slate-300">Crie o perfil de acesso e credenciais para o sistema</p>
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
            <form onSubmit={handleSubmeterNovoUsuario} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {erroForm && (
                <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 rounded-xl text-xs font-semibold">
                  {erroForm}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Nome Completo do Colaborador <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  placeholder="Ex: Roberto Almeida Costa"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Login / Matrícula de Acesso <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder="Ex: Mecanico03 ou roberto.costa"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Cargo / Especialidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    placeholder="Ex: Mecânico Sênior de Freios"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="roberto@bikehub.com.br"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 97000-0000"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
              </div>

              {/* Perfil de Acesso */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Perfil de Acesso & Permissões <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { valor: 'MECANICO', label: 'Mecânico', desc: 'Bancada & OS' },
                    { valor: 'ATENDENTE', label: 'Atendente', desc: 'Vendas & Balcão' },
                    { valor: 'ADMIN', label: 'Administrador', desc: 'Acesso Total' },
                  ].map((opt) => (
                    <button
                      key={opt.valor}
                      type="button"
                      onClick={() => setPerfil(opt.valor as PerfilUsuario)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        perfil === opt.valor
                          ? 'border-[#E67E22] bg-orange-50/80 dark:bg-orange-950/60 text-[#E67E22] ring-2 ring-orange-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750'
                      }`}
                    >
                      <span className="text-xs block">{opt.label}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Senha e Confirmação */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Senha de Acesso {!usuarioEmEdicao && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder={usuarioEmEdicao ? 'Deixe vazio para manter a senha' : '••••••••'}
                    required={!usuarioEmEdicao}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirmar Senha {!usuarioEmEdicao && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={confirmacaoSenha}
                    onChange={(e) => setConfirmacaoSenha(e.target.value)}
                    placeholder="••••••••"
                    required={!usuarioEmEdicao}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E67E22] focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
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
                  <UserPlus className="w-4 h-4" />
                  <span>{usuarioEmEdicao ? 'Salvar Alterações' : 'Salvar Usuário'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
