import {
  AluguelRegistro,
  Bicicleta,
  BicicletaCatalogo,
  Cliente,
  Servico,
  StatusServico,
  Usuario,
  VendaRegistro,
} from '../types';

// Endereço do backend Spring Boot responsável pela persistência no MySQL.
const CLIENTES_API_URL = 'http://localhost:8080/api/clientes';

// Estrutura recebida do formulário integrado antes de ser convertida em JSON.
export interface CriarClienteDados {
  cliente: Omit<Cliente, 'id' | 'dataCadastro'>;
  bicicleta?: Omit<Bicicleta, 'id' | 'clienteId'>;
}

export interface AtualizarClienteDados extends CriarClienteDados {
  bicicletaId?: number;
}

// Extrai a mensagem devolvida pelo backend e fornece uma alternativa para respostas sem JSON.
async function obterMensagemErro(response: Response): Promise<string> {
  try {
    const body = await response.json();
    return body.mensagem || body.message || `Erro HTTP ${response.status}.`;
  } catch {
    return `Erro HTTP ${response.status}.`;
  }
}

/** Busca no MySQL, por meio do Spring Boot, todos os clientes cadastrados. */
export async function listarClientes(): Promise<Cliente[]> {
  let response: Response;
  try {
    response = await fetch(CLIENTES_API_URL);
  } catch {
    throw new Error('Não foi possível conectar ao servidor do BikeHub. Verifique se o Spring Boot está ativo.');
  }

  if (!response.ok) {
    throw new Error(await obterMensagemErro(response));
  }

  return response.json();
}

/** Envia os dados do cliente e da bicicleta para persistência pelo backend. */
export async function criarCliente(dados: CriarClienteDados): Promise<Cliente> {
  let response: Response;
  try {
    response = await fetch(CLIENTES_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: dados.cliente.nome,
        telefone: dados.cliente.telefone,
        email: dados.cliente.email,
        cpf: dados.cliente.cpf,
        endereco: dados.cliente.endereco,
        marca: dados.bicicleta?.marca,
        modelo: dados.bicicleta?.modelo,
        cor: dados.bicicleta?.cor,
        ano: dados.bicicleta?.ano,
        numeroSerie: dados.bicicleta?.numeroSerie,
      }),
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor do BikeHub. Verifique se o Spring Boot está ativo.');
  }

  if (!response.ok) {
    throw new Error(await obterMensagemErro(response));
  }

  return response.json();
}

export async function atualizarCliente(id: number, dados: AtualizarClienteDados): Promise<Cliente> {
  return requisicaoApi<Cliente>(`/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
      nome: dados.cliente.nome,
      telefone: dados.cliente.telefone,
      email: dados.cliente.email,
      cpf: dados.cliente.cpf,
      endereco: dados.cliente.endereco,
      bicicletaId: dados.bicicletaId,
      marca: dados.bicicleta?.marca,
      modelo: dados.bicicleta?.modelo,
      cor: dados.bicicleta?.cor,
      ano: dados.bicicleta?.ano,
      numeroSerie: dados.bicicleta?.numeroSerie,
    }),
  });
}

/** Solicita a exclusão e só conclui quando o backend confirma a operação. */
export async function excluirCliente(id: number): Promise<void> {
  let response: Response;
  try {
    response = await fetch(`${CLIENTES_API_URL}/${id}`, { method: 'DELETE' });
  } catch {
    throw new Error('Não foi possível conectar ao servidor do BikeHub. Verifique se o Spring Boot está ativo.');
  }

  if (!response.ok) {
    throw new Error(await obterMensagemErro(response));
  }
}

const API_BASE_URL = 'http://localhost:8080/api';

/** Executa as chamadas dos demais módulos com tratamento uniforme de rede e HTTP. */
async function requisicaoApi<T>(caminho: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${caminho}`, {
      ...init,
      headers: init?.body ? { 'Content-Type': 'application/json', ...init.headers } : init?.headers,
    });
  } catch {
    throw new Error('Não foi possível conectar ao servidor do BikeHub. Verifique se o Spring Boot está ativo.');
  }
  if (!response.ok) throw new Error(await obterMensagemErro(response));
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const listarServicos = () => requisicaoApi<Servico[]>('/servicos');
export const criarServico = (dados: Omit<Servico, 'id' | 'clienteNome' | 'clienteTelefone' | 'bicicletaDescricao'>) =>
  requisicaoApi<Servico>('/servicos', { method: 'POST', body: JSON.stringify(dados) });
export const atualizarServico = (id: number, dados: Omit<Servico, 'id' | 'clienteNome' | 'clienteTelefone' | 'bicicletaDescricao'>) =>
  requisicaoApi<Servico>(`/servicos/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
export const atualizarStatusServico = (id: number, status: StatusServico) =>
  requisicaoApi<Servico>(`/servicos/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
export const excluirServico = (id: number) =>
  requisicaoApi<void>(`/servicos/${id}`, { method: 'DELETE' });

export const listarCatalogo = () => requisicaoApi<BicicletaCatalogo[]>('/catalogo');
export const criarItemCatalogo = (dados: Omit<BicicletaCatalogo, 'id'>) =>
  requisicaoApi<BicicletaCatalogo>('/catalogo', { method: 'POST', body: JSON.stringify(dados) });

export const listarUsuarios = () => requisicaoApi<Usuario[]>('/usuarios');
export const salvarUsuario = (dados: Omit<Usuario, 'id'> | Usuario) =>
  requisicaoApi<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(dados) });
export const excluirUsuario = (id: number) =>
  requisicaoApi<void>(`/usuarios/${id}`, { method: 'DELETE' });
export const alternarStatusUsuario = (id: number) =>
  requisicaoApi<Usuario>(`/usuarios/${id}/status`, { method: 'PATCH' });

export const listarVendas = () => requisicaoApi<VendaRegistro[]>('/vendas');
export const registrarVenda = (dados: Omit<VendaRegistro, 'id'>) =>
  requisicaoApi<VendaRegistro>('/vendas', { method: 'POST', body: JSON.stringify(dados) });

export const listarAlugueis = () => requisicaoApi<AluguelRegistro[]>('/alugueis');
export const registrarAluguel = (dados: Omit<AluguelRegistro, 'id'>) =>
  requisicaoApi<AluguelRegistro>('/alugueis', { method: 'POST', body: JSON.stringify(dados) });

export interface DadosDevolucaoAluguel {
  contratoId: number;
  bikeId: number;
  dataDevolucaoEfetiva: string;
  horaDevolucaoEfetiva: string;
  valorCaucaoDevolvido: number;
  taxaAvariaOuAtraso: number;
  motivoTaxa?: string;
  metodoDevolucaoCaucao: string;
  observacaoDevolucao: string;
}

export const registrarDevolucaoAluguel = (dados: DadosDevolucaoAluguel) =>
  requisicaoApi<AluguelRegistro>(`/alugueis/${dados.contratoId}/devolucao`, {
    method: 'PATCH',
    body: JSON.stringify(dados),
  });
