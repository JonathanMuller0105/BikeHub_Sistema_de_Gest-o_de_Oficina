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

import React, { useEffect, useState } from 'react';
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
  SERVICOS_CATALOGO_INICIAL,
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
import {
  alternarStatusUsuario,
  atualizarCliente,
  atualizarStatusServico,
  criarCliente,
  criarItemCatalogo,
  criarServico,
  excluirCliente,
  excluirServico,
  excluirUsuario,
  listarAlugueis,
  listarCatalogo,
  listarClientes,
  listarServicos,
  listarUsuarios,
  listarVendas,
  registrarAluguel,
  registrarDevolucaoAluguel,
  registrarVenda,
  salvarUsuario,
} from './services/api';

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
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [catalogo, setCatalogo] = useState<BicicletaCatalogo[]>([]);
  const [servicosCatalogo, setServicosCatalogo] = useState<ServicoCatalogo[]>(SERVICOS_CATALOGO_INICIAL);
  const [vendas, setVendas] = useState<VendaRegistro[]>([]);
  const [alugueis, setAlugueis] = useState<AluguelRegistro[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  
  // Cliente pré-selecionado para abertura direta de OS
  const [clientePreSelecionadoOS, setClientePreSelecionadoOS] = useState<number | null>(null);
  const [clienteEmEdicao, setClienteEmEdicao] = useState<Cliente | null>(null);

  // Mensagem flash de notificação
  const [notificacao, setNotificacao] = useState<string | null>(null);

  const dispararNotificacao = (msg: string) => {
    setNotificacao(msg);
    setTimeout(() => setNotificacao(null), 4000);
  };

  // Carrega os clientes persistidos no MySQL quando a aplicação é montada.
  useEffect(() => {
    let ativo = true;

    listarClientes()
      .then((clientesCarregados) => {
        if (ativo) setClientes(clientesCarregados);
      })
      .catch((erro: Error) => {
        if (ativo) dispararNotificacao(`Erro ao carregar clientes: ${erro.message}`);
      });

    return () => {
      ativo = false;
    };
  }, []);

  // Carrega os demais módulos persistidos sem bloquear um módulo quando outro falhar.
  useEffect(() => {
    const carregar = <T,>(consulta: () => Promise<T>, atualizar: (dados: T) => void, nome: string) => {
      consulta().then(atualizar).catch((erro: Error) =>
        dispararNotificacao(`Erro ao carregar ${nome}: ${erro.message}`)
      );
    };
    carregar(listarServicos, setServicos, 'serviços');
    carregar(listarCatalogo, setCatalogo, 'catálogo');
    carregar(listarUsuarios, setUsuarios, 'usuários');
    carregar(listarVendas, setVendas, 'vendas');
    carregar(listarAlugueis, setAlugueis, 'aluguéis');
  }, []);

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

  // Salva cliente e bicicleta pela API e usa os IDs reais gerados pelo MySQL.
  const handleSalvarClienteIntegrado = (
    novoCliente: Omit<Cliente, 'id' | 'dataCadastro'>,
    novaBicicleta: Omit<Bicicleta, 'id' | 'clienteId'>
  ) => {
    criarCliente({ cliente: novoCliente, bicicleta: novaBicicleta })
      .then((clienteCriado) => {
        setClientes((clientesAtuais) => [clienteCriado, ...clientesAtuais]);
        setAbaAtiva('clientes');
        dispararNotificacao(`Cliente "${clienteCriado.nome}" e bicicleta cadastrados com sucesso!`);
      })
      .catch((erro: Error) => {
        dispararNotificacao(`Erro ao cadastrar cliente: ${erro.message}`);
      });
  };

  // Exclui primeiro no backend e só então atualiza a lista exibida pelo React.
  const handleExcluirCliente = (id: number) => {
    excluirCliente(id)
      .then(() => {
        setClientes((clientesAtuais) => clientesAtuais.filter((c) => c.id !== id));
        dispararNotificacao('Cliente e bicicletas vinculadas removidos com sucesso.');
      })
      .catch((erro: Error) => {
        dispararNotificacao(`Erro ao excluir cliente: ${erro.message}`);
      });
  };

  const handleAtualizarCliente = (
    id: number,
    cliente: Omit<Cliente, 'id' | 'dataCadastro'>,
    bicicleta: Omit<Bicicleta, 'clienteId'>
  ) => {
    atualizarCliente(id, {
      cliente,
      bicicleta,
      bicicletaId: bicicleta.id || undefined,
    })
      .then((atualizado) => {
        setClientes((atuais) => atuais.map((item) => item.id === id ? atualizado : item));
        setClienteEmEdicao(null);
        setAbaAtiva('clientes');
        dispararNotificacao(`Cliente "${atualizado.nome}" atualizado com sucesso!`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao atualizar cliente: ${erro.message}`));
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
    criarServico(novaOS)
      .then((osCriada) => {
        setServicos((atuais) => [osCriada, ...atuais]);
        setClientePreSelecionadoOS(null);
        setAbaAtiva('servicos');
        dispararNotificacao(`Ordem de Serviço #${osCriada.id} aberta com sucesso!`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao abrir OS: ${erro.message}`));
  };

  // Handler para Atualizar Status de OS
  const handleAtualizarStatusOS = (osId: number, novoStatus: StatusServico) => {
    atualizarStatusServico(osId, novoStatus)
      .then((osAtualizada) => {
        setServicos((atuais) => atuais.map((s) => (s.id === osId ? osAtualizada : s)));
        dispararNotificacao(`Status da OS #${osId} alterado com sucesso.`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao alterar status: ${erro.message}`));
  };

  // Handler para Excluir OS
  const handleExcluirOS = (osId: number) => {
    excluirServico(osId)
      .then(() => {
        setServicos((atuais) => atuais.filter((s) => s.id !== osId));
        dispararNotificacao(`Ordem de Serviço #${osId} excluída.`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao excluir OS: ${erro.message}`));
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
    registrarVenda(dados)
      .then((vendaCriada) => {
        setVendas((atuais) => [vendaCriada, ...atuais]);
        setCatalogo((atual) => atual.map((b) =>
          b.id === dados.bicicletaId ? { ...b, disponivel: false } : b
        ));
        dispararNotificacao(`Venda da ${dados.bicicletaDescricao} liquidada via ${dados.formaPagamento}!`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao registrar venda: ${erro.message}`));
  };

  // Handler para Registrar Novo Aluguel
  const handleRegistrarNovoAluguel = (dados: Omit<AluguelRegistro, 'id'>) => {
    registrarAluguel(dados)
      .then((aluguelCriado) => {
        setAlugueis((atuais) => [aluguelCriado, ...atuais]);
        setCatalogo((atual) => atual.map((b) =>
          b.id === dados.bicicletaId ? { ...b, disponivel: false } : b
        ));
        dispararNotificacao(`Contrato ${dados.codigoContrato} emitido para ${dados.clienteNome}!`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao emitir contrato: ${erro.message}`));
  };

  // Handler para Devolução de Aluguel Simples
  const handleDevolverAluguel = (contratoId: number, bikeId: number) => {
    const contrato = alugueis.find((a) => a.id === contratoId);
    if (!contrato) return;
    const agora = new Date();
    registrarDevolucaoAluguel({
      contratoId,
      bikeId,
      dataDevolucaoEfetiva: agora.toISOString().split('T')[0],
      horaDevolucaoEfetiva: agora.toTimeString().slice(0, 5),
      valorCaucaoDevolvido: contrato.valorCaucao,
      taxaAvariaOuAtraso: 0,
      metodoDevolucaoCaucao: 'DINHEIRO',
      observacaoDevolucao: 'Devolução simples sem ocorrência.',
    }).then((atualizado) => {
      setAlugueis((atuais) => atuais.map((a) => a.id === contratoId ? atualizado : a));
      setCatalogo((atual) => atual.map((b) => b.id === bikeId ? { ...b, disponivel: true } : b));
      dispararNotificacao('Devolução registrada com sucesso! A bicicleta retornou ao estoque disponível.');
    }).catch((erro: Error) => dispararNotificacao(`Erro na devolução: ${erro.message}`));
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
    registrarDevolucaoAluguel(dados)
      .then((atualizado) => {
        setAlugueis((atuais) => atuais.map((a) => a.id === dados.contratoId ? atualizado : a));
        setCatalogo((atual) => atual.map((b) =>
          b.id === dados.bikeId ? { ...b, disponivel: true } : b
        ));
        dispararNotificacao(`Devolução concluída! Caução de R$ ${dados.valorCaucaoDevolvido.toFixed(2)} liquidado via ${dados.metodoDevolucaoCaucao}.`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro na devolução: ${erro.message}`));
  };

  // Handler para Cadastrar Nova Bicicleta (Aluguel ou Venda)
  const handleCadastrarNovaBicicleta = (novaBike: Omit<BicicletaCatalogo, 'id'>) => {
    criarItemCatalogo(novaBike)
      .then((bikeCriada) => {
        setCatalogo((atual) => [bikeCriada, ...atual]);
        dispararNotificacao(
          `Bicicleta "${novaBike.marca} ${novaBike.modelo}" incluída com sucesso na ${
            novaBike.tipo === 'ALUGUEL' ? 'frota de aluguel' : 'área de vendas'
          }!`
        );
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao cadastrar bicicleta: ${erro.message}`));
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
    salvarUsuario(usuario)
      .then((usuarioSalvo) => {
        setUsuarios((atuais) => {
          const existe = atuais.some((u) => u.id === usuarioSalvo.id);
          return existe
            ? atuais.map((u) => u.id === usuarioSalvo.id ? usuarioSalvo : u)
            : [usuarioSalvo, ...atuais];
        });
        dispararNotificacao(`Funcionário "${usuarioSalvo.nomeCompleto}" salvo com sucesso!`);
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao salvar funcionário: ${erro.message}`));
  };

  const handleExcluirUsuario = (id: number) => {
    excluirUsuario(id)
      .then(() => {
        setUsuarios((atuais) => atuais.filter((u) => u.id !== id));
        dispararNotificacao('Usuário/Funcionário removido do sistema.');
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao excluir funcionário: ${erro.message}`));
  };

  const handleAlternarStatusUsuario = (id: number) => {
    alternarStatusUsuario(id)
      .then((usuarioAtualizado) => {
        setUsuarios((atuais) => atuais.map((u) => u.id === id ? usuarioAtualizado : u));
      })
      .catch((erro: Error) => dispararNotificacao(`Erro ao alterar usuário: ${erro.message}`));
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
            onEditarCliente={(cliente) => {
              setClienteEmEdicao(cliente);
              setAbaAtiva('cliente-novo');
            }}
          />
        )}

        {abaAtiva === 'cliente-novo' && (
          <ClienteFormView
            onSalvarClienteIntegrado={handleSalvarClienteIntegrado}
            clienteEmEdicao={clienteEmEdicao}
            onAtualizarCliente={handleAtualizarCliente}
            onNavegar={(aba) => {
              setClienteEmEdicao(null);
              setAbaAtiva(aba);
            }}
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
