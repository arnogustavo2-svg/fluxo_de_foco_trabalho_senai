// Espelha as entidades do backend arquitetural (deepseek_python_20260612).
// Fonte de verdade: User, Curso, Material, Tarefa, Meta, SessaoPomodoro,
// Revisao, Notificacao, DiagnosticoInicial, RecomendacaoEstudo.

export type UserRole = "aluno" | "admin";
export type TaskPriority = "baixa" | "media" | "alta";
export type TaskStatus = "pendente" | "em_andamento" | "concluida" | "atrasada";
export type GoalType = "diaria" | "semanal" | "mensal";
export type PomodoroType = "foco" | "pausa";
export type MaterialType = "pdf" | "video" | "link" | "documento";
export type ReviewStatus = "pendente" | "concluida" | "atrasada";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  data_criacao: string;
  consentimento_lgpd: boolean;
  foto_url?: string;
}

export interface Curso {
  id: string;
  titulo: string;
  descricao: string;
  criador_id: string;
  data_criacao: string;
  ativo: boolean;
  // Derivados (calculados no front a partir de materiais/tarefas)
  progresso?: number;
  cor?: string;
}

export interface Material {
  id: string;
  curso_id: string;
  tipo: MaterialType;
  titulo: string;
  url_ou_conteudo: string;
  data_upload: string;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  curso_id: string;
  prazo: string;
  prioridade: TaskPriority;
  status: TaskStatus;
  data_criacao: string;
  responsavel_id: string;
}

export interface Meta {
  id: string;
  aluno_id: string;
  tipo: GoalType;
  descricao: string;
  horas_estudo_alvo: number;
  horas_acumuladas: number;
  data_inicio: string;
  data_fim: string;
  concluida: boolean;
}

export interface SessaoPomodoro {
  id: string;
  aluno_id: string;
  tipo: PomodoroType;
  duracao_minutos: number;
  inicio: string;
  fim: string;
  tarefa_id?: string;
}

export interface Revisao {
  id: string;
  aluno_id: string;
  material_id: string;
  data_programada: string;
  data_realizada?: string;
  status: ReviewStatus;
  intervalo_dias: 1 | 7 | 30;
}

export interface Notificacao {
  id: string;
  usuario_id: string;
  mensagem: string;
  lida: boolean;
  data_criacao: string;
  tipo: "tarefa" | "revisao" | "meta" | "pausa" | "sistema";
}

export interface DiagnosticoInicial {
  id: string;
  aluno_id: string;
  nivel_foco: number;
  horas_disponiveis_dia: number;
  sobrecarga_percebida: number;
  observacoes: string;
  data_criacao: string;
}

export interface RecomendacaoEstudo {
  id: string;
  aluno_id: string;
  mensagem: string;
  baseada_em: string;
  data_geracao: string;
}