import type {
  Curso, Material, Tarefa, Meta, SessaoPomodoro,
  Revisao, Notificacao, RecomendacaoEstudo,
} from "@/types";

// Sem dados de exemplo: o usuário começa com a aplicação vazia
// e cria seus próprios cursos, materiais, tarefas, metas, etc.

export const seedCursos: Curso[] = [];
export const seedMateriais: Material[] = [];
export const seedTarefas: Tarefa[] = [];
export const seedMetas: Meta[] = [];
export const seedSessoes: SessaoPomodoro[] = [];
export const seedRevisoes: Revisao[] = [];
export const seedNotificacoes: Notificacao[] = [];
export const seedRecomendacoes: RecomendacaoEstudo[] = [];

export const mockData = {
  cursos: seedCursos,
  materiais: seedMateriais,
  tarefas: seedTarefas,
  metas: seedMetas,
  sessoes_pomodoro: seedSessoes,
  revisoes: seedRevisoes,
  notificacoes: seedNotificacoes,
  recomendacoes: seedRecomendacoes,
};
