/**
 * ======================================================================
 * TIPOS E MODELOS TYPESCRIPT - BIKEHUB
 * Localização: src/types.ts
 * ======================================================================
 * Espelha rigorosamente as entidades JPA do Spring Boot:
 * Usuario, Cliente, Bicicleta, Servico, BicicletaCatalogo e Enums.
 */

export type PerfilUsuario = 'ADMIN' | 'MECANICO' | 'ATENDENTE';

export interface Usuario {
  id: number;
  login: string;
  senha?: string;
  nomeCompleto: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  perfil: PerfilUsuario;
  ativo?: boolean;
  dataCadastro?: string;
}

export type CategoriaServico = 'REVISAO' | 'FREIOS' | 'TRANSMISSAO' | 'SUSPENSAO' | 'RODAS_PNEUS' | 'AJUSTES' | 'LAVAGEM';

export interface ServicoCatalogo {
  id: number;
  nome: string;
  categoria: CategoriaServico;
  valor: number;
  tempoEstimado: string;
  descricao: string;
  ativo: boolean;
  incluiPecas: boolean;
}

export interface Bicicleta {
  id: number;
  marca: string;
  modelo: string;
  cor: string;
  ano: number;
  numeroSerie?: string;
  clienteId: number;
}

export interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  cpf?: string;
  endereco?: string;
  bicicletas: Bicicleta[];
  dataCadastro: string;
}

export type StatusServico = 'PENDENTE' | 'ANALISE' | 'MANUTENCAO' | 'PRONTO' | 'ENTREGUE';

export interface StatusInfo {
  chave: StatusServico;
  descricao: string;
  badgeBg: string;
  badgeColor: string;
  borderColor: string;
  dotColor: string;
}

export interface Servico {
  id: number;
  clienteId: number;
  clienteNome: string;
  clienteTelefone: string;
  bicicletaId: number;
  bicicletaDescricao: string;
  descricao: string;
  valor: number;
  dataEntrada: string;
  dataEntrega: string;
  status: StatusServico;
}

export type FaixaEtaria = 'INFANTIL' | 'JUVENIL' | 'ADULTO';
export type TipoCatalogo = 'VENDA' | 'ALUGUEL';

export interface BicicletaCatalogo {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
  descricao: string;
  valor: number;
  faixaEtaria: FaixaEtaria;
  tipo: TipoCatalogo;
  imagemUrl: string;
  disponivel: boolean;
  numeroSerie?: string;
}

export type FormaPagamento = 'PIX' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'DINHEIRO';

export interface VendaRegistro {
  id: number;
  bicicletaId: number;
  bicicletaDescricao: string;
  clienteNome: string;
  clienteCpf: string;
  clienteTelefone: string;
  clienteEmail: string;
  valorOriginal: number;
  desconto: number;
  valorFinal: number;
  formaPagamento: FormaPagamento;
  parcelas?: number;
  dataVenda: string;
  garantiaMeses: number;
}

export interface AluguelRegistro {
  id: number;
  codigoContrato: string;
  bicicletaId: number;
  bicicletaDescricao: string;
  clienteNome: string;
  clienteCpf: string;
  clienteTelefone: string;
  clienteEmail: string;
  clienteEndereco?: string;
  dataRetirada: string;
  horaRetirada: string;
  dataDevolucaoPrevista: string;
  horaDevolucaoPrevista: string;
  dataDevolucaoEfetiva?: string;
  horaDevolucaoEfetiva?: string;
  quantidadeDiarias: number;
  valorDiaria: number;
  valorTotal: number;
  valorCaucao: number;
  valorCaucaoDevolvido?: number;
  taxaAvariaOuAtraso?: number;
  motivoTaxa?: string;
  metodoDevolucaoCaucao?: string;
  observacaoDevolucao?: string;
  formaPagamento: FormaPagamento;
  acessorios: string[];
  status: 'EM_ANDAMENTO' | 'DEVOLVIDO' | 'ATRASADO';
  dataCriacao: string;
}

export type ModoTema = 'sistema' | 'claro' | 'escuro';

export type AbaNavegacao = 
  | 'dashboard' 
  | 'clientes' 
  | 'cliente-novo' 
  | 'servicos' 
  | 'servico-novo' 
  | 'tabela-servicos' 
  | 'vendas' 
  | 'aluguel' 
  | 'usuarios' 
  | 'codigo-spring';
