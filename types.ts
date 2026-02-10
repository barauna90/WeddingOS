
export enum Priority {
  CRITICA = 'critica',
  ALTA = 'alta',
  MEDIA = 'media',
  BAIXA = 'baixa'
}

export enum TaskStatus {
  PENDENTE = 'pendente',
  EM_ANDAMENTO = 'em_andamento',
  CONCLUIDA = 'concluida',
  BLOQUEADA = 'bloqueada'
}

export enum RSVPStatus {
  NAO_ENVIADO = 'nao_enviado',
  ENVIADO = 'enviado',
  CONFIRMADO = 'confirmado',
  NAO_VAI = 'nao_vai',
  TALVEZ = 'talvez'
}

export enum GodparentRole {
  PADRINHO = 'padrinho',
  MADRINHA = 'madrinha',
  DAMA = 'dama',
  PAJEM = 'pajem',
  OUTRO = 'outro'
}

export enum GiftStatus {
  DISPONIVEL = 'disponivel',
  RESERVADO = 'reservado',
  RECEBIDO = 'recebido'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  dependencies?: string[];
}

export interface Guest {
  id: string;
  name: string;
  group: string;
  plusOnes: number;
  rsvpStatus: RSVPStatus;
  phone: string;
}

export interface Godparent {
  id: string;
  name: string;
  role: GodparentRole;
  contact: string;
  status: 'convidado' | 'confirmado';
  notes?: string;
}

export interface Gift {
  id: string;
  name: string;
  category: string;
  estimatedValue: number;
  status: GiftStatus;
  giverName?: string;
  message?: string;
  listType: 'casamento' | 'cha_de_panela' | 'custom';
}

export interface Transaction {
  id: string;
  description: string;
  value: number;
  date: string;
  category: string;
  status: 'pago' | 'pendente' | 'atrasado';
  type: 'receita' | 'despesa';
}

export interface WeddingData {
  name: string;
  date: string;
  budget: number;
  guestsEstimate: number;
  style: string;
  city: string;
}

export interface WeddingStore {
  wedding: WeddingData;
  tasks: Task[];
  guests: Guest[];
  transactions: Transaction[];
  updateWedding: (data: Partial<WeddingData>) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addGuest: (guest: Guest) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
}
