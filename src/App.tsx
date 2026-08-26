/**
 * ======================================================================
 * APLICAÇÃO PRINCIPAL BIKEHUB - REACT + VITE PREVIEW INTERATIVO
 * Localização: src/App.tsx
 * ======================================================================
 * Integra em tempo real todas as funcionalidades da arquitetura BikeHub:
 * 1. Autenticação e Gestão de Sessão (HttpSession / Spring Security)
 * 2. Painel Geral (Dashboard com Métricas e Pipeline de Status)
 * 3. Gestão de Clientes e Cadastro Integrado em 2 Seções (Cliente + Bicicleta)
 * 4. Ordens de Serviço (Oficina Mecânica) com filtros e atualização de status
 * 5. Tabela de Serviços Prestados e Cadastro de Novos Serviços com Preço Sugerido
 * 6. Catálogo Comercial de Venda de Bicicletas Semi-Novas (com Checkout PIX/Cartão e Garantia)
 * 7. Catálogo de Aluguel e Locação por Diária (com Busca de Cliente e Emissão de Contrato)
 * 8. Gestão de Usuários e Funcionários da Oficina (Perfis ADMIN / MECANICO / ATENDENTE)
 * 9. Visualizador Integrado de Código-Fonte Spring Boot 3 (Java 21, DDL/DML, Thymeleaf)
 */

import React, { useState } from 'react';
import { 
  Usuario, 
  Cliente, 
  Servico, 
  BicicletaCatalogo, 
  AbaNavegacao, 
  StatusServico, 
  Bicicleta,
  ServicoCatalogo,
  VendaRegistro,
  AluguelRegistro
} from './types';
import { 
  CLIENTES_INICIAIS, 
  SERVICOS_INICIAIS, 
  CATALOGO_INICIAL,
  USUARIOS_INICIAIS,
  SERVICOS_CATALOGO_INICIAL,
  VENDAS_INICIAIS,
  ALUGUEIS_INICIAIS
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { TopHeader } from './components/TopHeader';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { ClientesView } from './components/ClientesView';
import { ClienteFormView } from './components/ClienteFormView';
import { ServicosView } from './components/ServicosView';
import { ServicoFormView } from './components/ServicoFormView';
import { TabelaServicosView } from './components/TabelaServicosView';
import { VendasView } from './components/VendasView';
import { AluguelView } from './components/AluguelView';
import { UsuariosView } from './components/UsuariosView';
import { SpringCodeViewer } from './components/SpringCodeViewer';
import { useTheme } from './hooks/useTheme';

export default function App() {
  // Gestão de Tema (Sistema, Claro, Escuro)
  const { tema, setTema, escuroEfetivo } = useTheme();

  // Estado de Menu Lateral Recolhido (persistido em localStorage)
  const [sidebarRecolhida, setSidebarRecolhida] = useState<boolean>(() => {
    return localStorage.getItem('bikehub_sidebar_recolhida') === 'true';
  });

  const handleAlternarSidebar = () => {
    setSidebarRecolhida((prev) => {
      const novo = !prev;
      localStorage.setItem('bikehub_sidebar_recolhida', String(novo));
      return novo;
    });
  };

  // Estado de Autenticação
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>({
    id: 1,
    login: 'Admin1234',
    nomeCompleto: 'Carlos Eduardo Silveira (Admin)',
    email: 'carlos.admin@bikehub.com.br',
    cargo: 'Gerente Geral & Sócio',
    perfil: 'ADMIN',
    ativo: true,
    dataCadastro: '2024-01-10',
  });

  // Estado de Navegação Ativa
  const [abaAtiva, setAbaAtiva] = useState<AbaNavegacao>('dashboard');

  // Estados dos Modelos de Dados
  const [clientes, setClientes] = useState<Cliente[]>(CLIENTES_INICIAIS);
  const [servicos, setServicos] = useState<Servico[]>(SERVICOS_INICIAIS);
  const [catalogo, setCatalogo] = useState<BicicletaCatalogo[]>(CATALOGO_INICIAL);
  const [servicosCatalogo, setServicosCatalogo] = useState<ServicoCatalogo[]>(SERVICOS_CATALOGO_INICIAL);
  const [vendas, setVendas] = useState<VendaRegistro[]>(VENDAS_INICIAIS);
  const [alugueis, setAlugueis] = useState<AluguelRegistro[]>(ALUGUEIS_INICIAIS);
  const [usuarios, setUsuarios] = useState<Usuario[]>(USUARIOS_INICIAIS);
  
  // Cliente pré-selecionado para abertura direta de OS
  const [clientePreSelecionadoOS, setClientePreSelecionadoOS] = useState<number | null>(null);

  // Mensagem flash de notificação
  const [notificacao, setNotificacao] = useState<string | null>(null);

  const dispararNotificacao = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 4000);
  };

  // Handler de Login
  const handleLoginSucesso = (usuario: Usuario) => {
    setUsuarioLogado(usuario);
    setAbaAtiva('dashboard');
    dispararNotificacao(`Bem-vindo de volta ao BikeHub, ${usuario.nomeCompleto}!`);
  };

  // Handler de Logout
  const handleLogout = () => {
    setUsuarioLogado(null);
  };

  // Handler para Salvar Cliente Integrado (com Bicicleta)
  const handleSalvarClienteIntegrado = (
    novoCliente: Omit<Cliente, 'id' | 'dataCadastro'>,
    novaBicicleta: Omit<Bicicleta, 'id' | 'clienteId'>
  ) => {
    const proximoClienteId = Math.max(...clientes.map((c) => c.id), 0) + 1;
    const proximaBikeId = Math.floor(Math.random() * 10000) + 10;

    const bikeCriada: Bicicleta = {
      ...novaBicicleta,
      id: proximaBikeId,
      clienteId: proximoClienteId,
    };

    const clienteCompleto: Cliente = {
      ...novoCliente,
      id: proximoClienteId,
      dataCadastro: new Date().toISOString().split('T')[0],
      bicicletas: [bikeCriada],
    };

    setClientes([clienteCompleto, ...clientes]);
    setAbaAtiva('clientes');
    dispararNotificacao(`Cliente "${clienteCompleto.nome}" e bicicleta cadastrados com sucesso!`);
  };

  // Handler para Excluir Cliente
  const handleExcluirCliente = (id: number) => {
    setClientes(clientes.filter((c) => c.id !== id));
    dispararNotificacao('Cliente e bicicletas vinculadas removidos com sucesso.');
  };

  // Handler para Abrir OS Direta para Cliente
  const handleAbrirOSParaCliente = (clienteId: number) => {
    setClientePreSelecionadoOS(clienteId);
    setAbaAtiva('servico-novo');
  };

  // Handler para Salvar Nova Ordem de Serviço
  const handleSalvarOS = (
    novaOS: Omit<Servico, 'id' | 'clienteNome' | 'clienteTelefone' | 'bicicletaDescricao'>
  ) => {
    const cliente = clientes.find((c) => c.id === novaOS.clienteId);
    const bike = cliente?.bicicletas.find((b) => b.id === novaOS.bicicletaId);

    const proximaOSId = Math.max(...servicos.map((s) => s.id), 0) + 1;

    const osCompleta: Servico = {
      ...novaOS,
      id: proximaOSId,
      clienteNome: cliente ? cliente.nome : 'Cliente Desconhecido',
      clienteTelefone: cliente ? cliente.telefone : '',
      bicicletaDescricao: bike
        ? `${bike.marca} ${bike.modelo} - ${bike.cor} (${bike.ano})`
        : 'Bicicleta não especificada',
    };

    setServicos([osCompleta, ...servicos]);
    setClientePreSelecionadoOS(null);
    setAbaAtiva('servicos');
    dispararNotificacao(`Ordem de Serviço #${proximaOSId} aberta com sucesso!`);
  };

  // Handler para Atualizar Status de OS
  const handleAtualizarStatusOS = (osId: number, novoStatus: StatusServico) => {
    setServicos(
      servicos.map((s) => (s.id === osId ? { ...s, status: novoStatus } : s))
    );
    dispararNotificacao(`Status da OS #${osId} alterado com sucesso.`);
  };

  // Handler para Excluir OS
  const handleExcluirOS = (osId: number) => {
    setServicos(servicos.filter((s) => s.id !== osId));
    dispararNotificacao(`Ordem de Serviço #${osId} excluída.`);
  };

  // Handler para Salvar Serviço no Catálogo de Oficina
  const handleSalvarServicoCatalogo = (servico: Omit<ServicoCatalogo, 'id'> | ServicoCatalogo) => {
    if ('id' in servico && servico.id) {
      // Edição
      setServicosCatalogo(
        servicosCatalogo.map((s) => (s.id === servico.id ? (servico as ServicoCatalogo) : s))
      );
      dispararNotificacao(`Serviço "${servico.nome}" atualizado no catálogo.`);
    } else {
      // Novo serviço
      const proximoId = Math.max(...servicosCatalogo.map((s) => s.id), 0) + 1;
      const novoItem: ServicoCatalogo = {
        ...servico,
        id: proximoId,
      };
      setServicosCatalogo([novoItem, ...servicosCatalogo]);
      dispararNotificacao(`Novo serviço "${novoItem.nome}" cadastrado com sucesso!`);
    }
  };

  // Handler para Excluir Serviço do Catálogo
  const handleExcluirServicoCatalogo = (id: number) => {
    setServicosCatalogo(servicosCatalogo.filter((s) => s.id !== id));
    dispararNotificacao('Serviço removido do catálogo de preços.');
  };

  // Handler para Alternar Status do Serviço no Catálogo
  const handleAlternarStatusServico = (id: number) => {
    setServicosCatalogo(
      servicosCatalogo.map((s) => (s.id === id ? { ...s, ativo: !s.ativo } : s))
    );
  };

  // Handler para Registrar Nova Venda de Bicicleta
  const handleRegistrarNovaVenda = (dados: Omit<VendaRegistro, 'id'>) => {
    const proximoId = Math.max(...vendas.map((v) => v.id), 0) + 1;
    const novaVenda: VendaRegistro = {
      ...dados,
      id: proximoId,
    };
    setVendas([novaVenda, ...vendas]);
    // Marca a bike como vendida no catálogo
    setCatalogo(
      catalogo.map((b) => (b.id === dados.bicicletaId ? { ...b, disponivel: false } : b))
    );
    dispararNotificacao(`Venda da ${dados.bicicletaDescricao} liquidada via ${dados.formaPagamento}!`);
  };

  // Handler para Registrar Novo Aluguel
  const handleRegistrarNovoAluguel = (dados: Omit<AluguelRegistro, 'id'>) => {
    const proximoId = Math.max(...alugueis.map((a) => a.id), 0) + 1;
    const novoAluguel: AluguelRegistro = {
      ...dados,
      id: proximoId,
    };
    setAlugueis([novoAluguel, ...alugueis]);
    // Marca a bike como alugada
    setCatalogo(
      catalogo.map((b) => (b.id === dados.bicicletaId ? { ...b, disponivel: false } : b))
    );
    dispararNotificacao(`Contrato ${dados.codigoContrato} emitido para ${dados.clienteNome}!`);
  };

  // Handler para Devolução de Aluguel Simples
  const handleDevolverAluguel = (contratoId: number, bikeId: number) => {
    setAlugueis(
      alugueis.map((a) => (a.id === contratoId ? { ...a, status: 'DEVOLVIDO' as const } : a))
    );
    setCatalogo(
      catalogo.map((b) => (b.id === bikeId ? { ...b, disponivel: true } : b))
    );
    dispararNotificacao('Devolução registrada com sucesso! A bicicleta retornou ao estoque disponível.');
  };

  // Handler para Devolução Completa de Aluguel com Vistoria e Quitação de Caução
  const handleDevolverAluguelComVistoria = (dados: {
    contratoId: number;
    bikeId: number;
    dataDevolucaoEfetiva: string;
    horaDevolucaoEfetiva: string;
    valorCaucaoDevolvido: number;
    taxaAvariaOuAtraso: number;
    motivoTaxa?: string;
    metodoDevolucaoCaucao: string;
    observacaoDevolucao: string;
  }) => {
    setAlugueis(
      alugueis.map((a) =>
        a.id === dados.contratoId
          ? {
              ...a,
              status: 'DEVOLVIDO' as const,
              dataDevolucaoEfetiva: dados.dataDevolucaoEfetiva,
              horaDevolucaoEfetiva: dados.horaDevolucaoEfetiva,
              valorCaucaoDevolvido: dados.valorCaucaoDevolvido,
              taxaAvariaOuAtraso: dados.taxaAvariaOuAtraso,
              motivoTaxa: dados.motivoTaxa,
              metodoDevolucaoCaucao: dados.metodoDevolucaoCaucao,
              observacaoDevolucao: dados.observacaoDevolucao,
            }
          : a
      )
    );
    setCatalogo(
      catalogo.map((b) => (b.id === dados.bikeId ? { ...b, disponivel: true } : b))
    );
    dispararNotificacao(`Devolução concluída! Caução de R$ ${dados.valorCaucaoDevolvido.toFixed(2)} liquidado via ${dados.metodoDevolucaoCaucao}.`);
  };

  // Handler para Cadastrar Nova Bicicleta (Aluguel ou Venda)
  const handleCadastrarNovaBicicleta = (novaBike: Omit<BicicletaCatalogo, 'id'>) => {
    const proximoId = Math.max(...catalogo.map((b) => b.id), 0) + 1;
    const bikeCompleta: BicicletaCatalogo = {
      ...novaBike,
      id: proximoId,
    };
    setCatalogo([bikeCompleta, ...catalogo]);
    dispararNotificacao(
      `Bicicleta "${novaBike.marca} ${novaBike.modelo}" incluída com sucesso na ${
        novaBike.tipo === 'ALUGUEL' ? 'frota de aluguel' : 'área de vendas'
      }!`
    );
  };

  // Handler para Locação Simples / Devolução
  const handleAlternarLocacao = (bikeId: number, alugar: boolean) => {
    setCatalogo(
      catalogo.map((b) => (b.id === bikeId ? { ...b, disponivel: !alugar } : b))
    );
    dispararNotificacao(
      alugar
        ? 'Locação registrada! A bicicleta está agora em uso pelo cliente.'
        : 'Devolução concluída! A bicicleta está disponível novamente para aluguel.'
    );
  };

  // Handlers para Gestão de Usuários / Funcionários
  const handleSalvarUsuario = (usuario: Omit<Usuario, 'id'> | Usuario) => {
    if ('id' in usuario && usuario.id) {
      setUsuarios(usuarios.map((u) => (u.id === usuario.id ? (usuario as Usuario) : u)));
      dispararNotificacao(`Dados do funcionário "${usuario.nomeCompleto}" atualizados.`);
    } else {
      const proximoId = Math.max(...usuarios.map((u) => u.id), 0) + 1;
      const novoUsuario: Usuario = {
        ...usuario,
        id: proximoId,
        dataCadastro: new Date().toISOString().split('T')[0],
      };
      setUsuarios([novoUsuario, ...usuarios]);
      dispararNotificacao(`Funcionário "${novoUsuario.nomeCompleto}" cadastrado com sucesso!`);
    }
  };

  const handleExcluirUsuario = (id: number) => {
    setUsuarios(usuarios.filter((u) => u.id !== id));
    dispararNotificacao('Usuário/Funcionário removido do sistema.');
  };

  const handleAlternarStatusUsuario = (id: number) => {
    setUsuarios(
      usuarios.map((u) => (u.id === id ? { ...u, ativo: !u.ativo } : u))
    );
  };

  // Se não estiver autenticado, exibe a tela de login
  if (!usuarioLogado) {
    return <LoginView onLoginSucesso={handleLoginSucesso} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] dark:bg-[#0B1120] text-[#2C3E50] dark:text-slate-100 font-sans antialiased selection:bg-[#E67E22] selection:text-white transition-colors duration-200">
      {/* Sidebar Fixa Lateral (Recolhível) */}
      <Sidebar
        abaAtiva={abaAtiva}
        onNavegar={(aba) => {
          if (aba === 'servicos') setClientePreSelecionadoOS(null);
          setAbaAtiva(aba);
        }}
        usuario={usuarioLogado}
        onLogout={handleLogout}
        quantidadeOS={servicos.filter((s) => s.status !== 'ENTREGUE').length}
        quantidadeServicosCatalogo={servicosCatalogo.length}
        recolhida={sidebarRecolhida}
        onAlternarRecolhida={handleAlternarSidebar}
        tema={tema}
        onAlterarTema={setTema}
        escuroEfetivo={escuroEfetivo}
      />

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full min-w-0">
        {/* Barra Superior com Alternador de Tema e Recolhimento de Menu */}
        <TopHeader
          abaAtiva={abaAtiva}
          sidebarRecolhida={sidebarRecolhida}
          onAlternarSidebar={handleAlternarSidebar}
          tema={tema}
          onAlterarTema={setTema}
          escuroEfetivo={escuroEfetivo}
          usuario={usuarioLogado}
          quantidadeOS={servicos.filter((s) => s.status !== 'ENTREGUE').length}
        />

        {/* Banner Flutuante de Notificação */}
        {notificacao && (
          <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl shadow-sm text-sm font-semibold flex items-center justify-between transition-all">
            <span>{notificacao}</span>
            <button
              onClick={() => setNotificacao(null)}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-100 text-xs font-bold ml-4 cursor-pointer"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Renderização Condicional de Vistas */}
        {abaAtiva === 'dashboard' && (
          <DashboardView
            clientes={clientes}
            servicos={servicos}
            catalogo={catalogo}
            onNavegar={setAbaAtiva}
            onAtualizarStatusOS={handleAtualizarStatusOS}
          />
        )}

        {abaAtiva === 'clientes' && (
          <ClientesView
            clientes={clientes}
            onNavegar={setAbaAtiva}
            onExcluirCliente={handleExcluirCliente}
            onAbrirOSParaCliente={handleAbrirOSParaCliente}
          />
        )}

        {abaAtiva === 'cliente-novo' && (
          <ClienteFormView
            onSalvarClienteIntegrado={handleSalvarClienteIntegrado}
            onNavegar={setAbaAtiva}
          />
        )}

        {abaAtiva === 'servicos' && (
          <ServicosView
            servicos={servicos}
            onNavegar={setAbaAtiva}
            onAtualizarStatusOS={handleAtualizarStatusOS}
            onExcluirOS={handleExcluirOS}
          />
        )}

        {abaAtiva === 'servico-novo' && (
          <ServicoFormView
            clientes={clientes}
            clientePreSelecionadoId={clientePreSelecionadoOS}
            onSalvarOS={handleSalvarOS}
            onNavegar={setAbaAtiva}
          />
        )}

        {abaAtiva === 'tabela-servicos' && (
          <TabelaServicosView
            servicosCatalogo={servicosCatalogo}
            onSalvarServico={handleSalvarServicoCatalogo}
            onExcluirServico={handleExcluirServicoCatalogo}
            onAlternarStatusServico={handleAlternarStatusServico}
            onNavegar={setAbaAtiva}
          />
        )}

        {abaAtiva === 'vendas' && (
          <VendasView
            catalogo={catalogo}
            clientesCadastrados={clientes}
            vendas={vendas}
            onRegistrarNovaVenda={handleRegistrarNovaVenda}
            onCadastrarNovaBicicleta={handleCadastrarNovaBicicleta}
          />
        )}

        {abaAtiva === 'aluguel' && (
          <AluguelView
            catalogo={catalogo}
            clientesCadastrados={clientes}
            alugueis={alugueis}
            onAlternarLocacao={handleAlternarLocacao}
            onRegistrarNovoAluguel={handleRegistrarNovoAluguel}
            onDevolverAluguel={handleDevolverAluguel}
            onDevolverAluguelComVistoria={handleDevolverAluguelComVistoria}
            onCadastrarNovaBicicleta={handleCadastrarNovaBicicleta}
          />
        )}

        {abaAtiva === 'usuarios' && (
          <UsuariosView
            usuarios={usuarios}
            onSalvarUsuario={handleSalvarUsuario}
            onExcluirUsuario={handleExcluirUsuario}
            onAlternarStatusUsuario={handleAlternarStatusUsuario}
          />
        )}

        {abaAtiva === 'codigo-spring' && (
          <SpringCodeViewer />
        )}
      </main>
    </div>
  );
}

