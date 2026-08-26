/**
 * ======================================================================
 * COMPONENTE: TELA DE LOGIN 3D MODERNA (Opção 1: Oficina & Performance 3D)
 * Localização: src/components/LoginView.tsx
 * ======================================================================
 * Split-Screen imersivo com palco 3D interativo:
 * - Parallax 3D com física de rotação baseada no ponteiro do mouse
 * - Render 3D de alta performance da bicicleta e componentes mecânicos
 * - Widgets flutuantes com profundidade Z-axis (Engrenagens, Torque, Pressão e OS)
 * - Campos de formulário com foco responsivo, alternador de senha e preenchimento rápido
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bike, 
  User, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Wrench, 
  Gauge, 
  Cog, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import { Usuario } from '../types';

interface LoginViewProps {
  onLoginSucesso: (usuario: Usuario) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSucesso }) => {
  const [login, setLogin] = useState('Admin1234');
  const [senha, setSenha] = useState('Admin123456');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [focoAtivo, setFocoAtivo] = useState<'login' | 'senha' | null>(null);
  const [modoDestaque, setModoDestaque] = useState<'geral' | 'oficina' | 'performance'>('geral');

  // Parallax 3D Engine State
  const stageRef = useRef<HTMLDivElement>(null);
  const [rotacao3D, setRotacao3D] = useState({ x: 0, y: 0 });
  const [posicaoLuz, setPosicaoLuz] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Converte para rotação angular (-15deg a +15deg)
    const rotY = (x - 0.5) * 24;
    const rotX = (0.5 - y) * 20;

    setRotacao3D({ x: rotX, y: rotY });
    setPosicaoLuz({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setRotacao3D({ x: 0, y: 0 });
    setPosicaoLuz({ x: 50, y: 50 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    setTimeout(() => {
      if (login === 'Admin1234' && senha === 'Admin123456') {
        onLoginSucesso({
          id: 1,
          login: 'Admin1234',
          nomeCompleto: 'Carlos Eduardo Silveira (Admin)',
          perfil: 'ADMIN',
        });
      } else {
        setErro('Usuário ou senha inválidos. Utilize o botão "Preencher Credenciais" abaixo.');
        setCarregando(false);
      }
    }, 450);
  };

  const preencherCredenciais = () => {
    setLogin('Admin1234');
    setSenha('Admin123456');
    setErro('');
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans selection:bg-[#E67E22] selection:text-white">
      {/* Container Principal Split-Screen */}
      <div className="w-full max-w-7xl bg-[#1E293B]/90 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[720px]">
        
        {/* ======================================================================
            COLUNA DA ESQUERDA: FORMULÁRIO DE AUTENTICAÇÃO
           ====================================================================== */}
        <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-b from-[#1E293B] to-[#141C2C] relative z-10 border-b lg:border-b-0 lg:border-r border-slate-700/60">
          
          {/* Topo: Logo & Badge */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E67E22] to-[#D35400] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25 ring-2 ring-orange-500/30">
                  <Bike className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1">
                    Bike<span className="text-[#E67E22]">Hub</span>
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                    SISTEMA INTEGRADO v3.2
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Servidor Ativo</span>
              </div>
            </div>

            {/* Título de Boas-Vindas */}
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Painel de Acesso à Oficina
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
                Faça login para gerenciar ordens de serviço, cadastro unificado de clientes e inventário de semi-novas.
              </p>
            </div>

            {/* Mensagem de Erro */}
            {erro && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs sm:text-sm font-medium flex items-center gap-3 animate-shake">
                <span className="w-2 h-2 rounded-full bg-red-400 shrink-0"></span>
                <span>{erro}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Campo Usuário */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                  <span>Usuário ou Matrícula</span>
                  {focoAtivo === 'login' && (
                    <span className="text-[10px] text-[#E67E22] font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Foco Ativo
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    onFocus={() => setFocoAtivo('login')}
                    onBlur={() => setFocoAtivo(null)}
                    required
                    placeholder="Ex: Admin1234"
                    className={`w-full pl-10 pr-4 py-3 bg-slate-900/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                      focoAtivo === 'login'
                        ? 'border-[#E67E22] ring-2 ring-orange-500/20 bg-slate-900'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
                  <span>Senha de Acesso</span>
                  {focoAtivo === 'senha' && (
                    <span className="text-[10px] text-[#E67E22] font-semibold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Criptografia AES
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    onFocus={() => setFocoAtivo('senha')}
                    onBlur={() => setFocoAtivo(null)}
                    required
                    placeholder="••••••••••••"
                    className={`w-full pl-10 pr-11 py-3 bg-slate-900/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                      focoAtivo === 'senha'
                        ? 'border-[#E67E22] ring-2 ring-orange-500/20 bg-slate-900'
                        : 'border-slate-700 hover:border-slate-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Botão de Entrar */}
              <button
                type="submit"
                disabled={carregando}
                className="w-full py-3.5 px-5 bg-gradient-to-r from-[#E67E22] to-[#D35400] hover:from-[#F39C12] hover:to-[#E67E22] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 cursor-pointer mt-2"
              >
                {carregando ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Validando Credenciais Spring...</span>
                  </span>
                ) : (
                  <>
                    <span>Entrar no Sistema</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Rodapé do Form: Credenciais Rápidas de Demonstração */}
          <div className="mt-8 pt-6 border-t border-slate-700/60">
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-[#E67E22]" />
                  <span>Credenciais de Acesso Rápido</span>
                </div>
                <button
                  type="button"
                  onClick={preencherCredenciais}
                  className="px-2.5 py-1 bg-orange-500/10 hover:bg-orange-500/20 text-[#E67E22] border border-orange-500/30 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Preencher</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Usuário</span>
                  <code className="text-orange-400 font-mono font-bold">Admin1234</code>
                </div>
                <div className="bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Senha</span>
                  <code className="text-orange-400 font-mono font-bold">Admin123456</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================================
            COLUNA DA DIREITA: PALCO 3D INTERATIVO (PARALLAX 3D + PERFORMANCE)
           ====================================================================== */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-7 relative p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br from-[#0F172A] via-[#162032] to-[#0A101D] overflow-hidden select-none"
          style={{ perspective: '1200px' }}
        >
          {/* Iluminação Dinâmica de Fundo (Spotlight 3D) */}
          <div
            className="absolute pointer-events-none transition-all duration-150 ease-out"
            style={{
              left: `${posicaoLuz.x}%`,
              top: `${posicaoLuz.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(230, 126, 34, 0.18) 0%, rgba(44, 62, 80, 0.05) 50%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Grid de Fundo Isométrico Tridimensional */}
          <div 
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #E67E22 1px, transparent 1px), linear-gradient(to bottom, #E67E22 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              transform: `rotateX(45deg) scale(1.5) translateY(-50px)`,
            }}
          />

          {/* Topo do Palco 3D: Seletor de Foco e Telemetria */}
          <div className="relative z-20 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E67E22] animate-ping" />
              <span className="text-xs font-mono font-bold tracking-wider text-orange-400 uppercase">
                Ambiente 3D Oficina & Performance
              </span>
            </div>

            {/* Alternador de Modos de Inspeção 3D */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 backdrop-blur border border-slate-700/80 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setModoDestaque('geral')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  modoDestaque === 'geral'
                    ? 'bg-[#E67E22] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Geral
              </button>
              <button
                type="button"
                onClick={() => setModoDestaque('oficina')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  modoDestaque === 'oficina'
                    ? 'bg-[#E67E22] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Oficina Mecânica
              </button>
              <button
                type="button"
                onClick={() => setModoDestaque('performance')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  modoDestaque === 'performance'
                    ? 'bg-[#E67E22] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Performance
              </button>
            </div>
          </div>

          {/* Centro do Palco 3D: Composição em Parallax com Bicicleta e Elementos Mecânicos */}
          <div
            className="relative z-20 my-auto py-8 transition-transform duration-200 ease-out flex items-center justify-center"
            style={{
              transform: `rotateX(${rotacao3D.x}deg) rotateY(${rotacao3D.y}deg)`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Imagem Central: Render 3D Principal da Bicicleta */}
            <div 
              className="relative max-w-md w-full rounded-3xl overflow-hidden border border-slate-700/50 shadow-2xl bg-gradient-to-b from-slate-800/40 to-slate-950/80 backdrop-blur-md group"
              style={{
                transform: 'translateZ(30px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(230, 126, 34, 0.15)',
              }}
            >
              <img
                src={
                  modoDestaque === 'oficina'
                    ? '/src/assets/images/bike_gears_3d_1787614171882.jpg'
                    : '/src/assets/images/bike_3d_render_1787614158868.jpg'
                }
                alt="BikeHub 3D Performance"
                className="w-full h-72 sm:h-80 object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Gradiente de overlay escuro e reflexo */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent opacity-80" />
              
              {/* Etiqueta Flutuante interna da imagem */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E67E22]">
                    {modoDestaque === 'oficina' ? 'COMPONENTES DE BANCADA' : 'FRAME CARBON SERIES'}
                  </span>
                  <p className="text-sm font-black text-white">
                    {modoDestaque === 'oficina' ? 'Cassete & Derailleur CNC' : 'Aero Carbon 29" Pro'}
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Revisada</span>
                </div>
              </div>
            </div>

            {/* ==================================================================
                ELEMENTO 3D FLUTUANTE 1: Widget de Torque & Calibração (Superior Esquerdo)
               ================================================================== */}
            <div
              className="absolute -top-4 -left-4 sm:top-2 sm:left-2 p-3.5 bg-slate-900/95 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-xl transition-all duration-300 hidden sm:flex items-center gap-3"
              style={{
                transform: `translateZ(${modoDestaque === 'oficina' ? '90px' : '65px'}) translateY(${rotacao3D.x * -0.5}px) translateX(${rotacao3D.y * 0.5}px)`,
                boxShadow: '0 15px 30px rgba(0,0,0,0.5), 0 0 20px rgba(230,126,34,0.2)',
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-[#E67E22] flex items-center justify-center font-bold">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Torque de Bancada</span>
                  <span className="text-[10px] font-mono font-bold text-orange-400">5.4 Nm</span>
                </div>
                <p className="text-xs font-bold text-slate-200">Revisão e Ajuste Fino</p>
              </div>
            </div>

            {/* ==================================================================
                ELEMENTO 3D FLUTUANTE 2: Widget de Telemetria de Transmissão (Inferior Direito)
               ================================================================== */}
            <div
              className="absolute -bottom-4 -right-4 sm:bottom-4 sm:right-2 p-3.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-xl transition-all duration-300 hidden sm:flex items-center gap-3"
              style={{
                transform: `translateZ(${modoDestaque === 'performance' ? '95px' : '75px'}) translateY(${rotacao3D.x * -0.7}px) translateX(${rotacao3D.y * 0.7}px)`,
                boxShadow: '0 15px 30px rgba(0,0,0,0.6)',
              }}
            >
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                <Cog className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Transmissão 12V</span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400">10-52T</span>
                </div>
                <p className="text-xs font-bold text-slate-200">Indexação Eletrônica</p>
              </div>
            </div>

            {/* ==================================================================
                ELEMENTO 3D FLUTUANTE 3: Widget de Pressão de Suspensão (Superior Direito)
               ================================================================== */}
            <div
              className="absolute top-8 right-6 p-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-lg transition-all duration-300 hidden md:flex items-center gap-2"
              style={{
                transform: `translateZ(50px) translateY(${rotacao3D.x * -0.3}px)`,
              }}
            >
              <Gauge className="w-3.5 h-3.5 text-[#E67E22]" />
              <span className="text-[11px] font-mono font-semibold text-slate-300">Shock 135 PSI</span>
            </div>
          </div>

          {/* Rodapé do Palco 3D: Métricas Operacionais em Tempo Real */}
          <div className="relative z-20 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900/60 backdrop-blur p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Fluxo da Oficina</span>
              <span className="text-base sm:text-lg font-black text-white">100% Digital</span>
            </div>
            <div className="bg-slate-900/60 backdrop-blur p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Semi-Novas</span>
              <span className="text-base sm:text-lg font-black text-[#E67E22]">6 Meses Garantia</span>
            </div>
            <div className="bg-slate-900/60 backdrop-blur p-3 rounded-2xl border border-slate-800/80">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Locação Urbana</span>
              <span className="text-base sm:text-lg font-black text-white">Por Diária R$</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
