import type {
  Curso, Material, Tarefa, Meta, SessaoPomodoro,
  Revisao, Notificacao, RecomendacaoEstudo,
} from "@/types";

// Dados de exemplo para o usuário Matheus.
const ALUNO_ID = "matheus";
const now = new Date();
const iso = (d: Date) => d.toISOString();
const addDays = (n: number) => { const d = new Date(now); d.setDate(d.getDate() + n); return d; };
const addHours = (n: number) => { const d = new Date(now); d.setHours(d.getHours() + n); return d; };

export const seedCursos: Curso[] = [
  { id: "c1", titulo: "Cálculo I", descricao: "Limites, derivadas e integrais aplicadas a problemas reais.", criador_id: "prof-01", data_criacao: iso(addDays(-40)), ativo: true, progresso: 62, cor: "#6366f1" },
  { id: "c2", titulo: "Programação em Python", descricao: "Da sintaxe básica a estruturas de dados e projetos práticos.", criador_id: "prof-02", data_criacao: iso(addDays(-30)), ativo: true, progresso: 78, cor: "#10b981" },
  { id: "c3", titulo: "Inglês Intermediário", descricao: "Leitura, escuta e conversação para nível B1/B2.", criador_id: "prof-03", data_criacao: iso(addDays(-25)), ativo: true, progresso: 45, cor: "#f59e0b" },
  { id: "c4", titulo: "História Contemporânea", descricao: "Século XX: guerras, revoluções e transformações sociais.", criador_id: "prof-04", data_criacao: iso(addDays(-20)), ativo: true, progresso: 30, cor: "#ef4444" },
];

export const seedMateriais: Material[] = [
  { id: "m1", curso_id: "c1", tipo: "pdf", titulo: "Apostila — Limites", url_ou_conteudo: "#", data_upload: iso(addDays(-35)) },
  { id: "m2", curso_id: "c1", tipo: "video", titulo: "Aula 03 — Derivadas", url_ou_conteudo: "#", data_upload: iso(addDays(-20)) },
  { id: "m3", curso_id: "c2", tipo: "link", titulo: "Documentação oficial do Python", url_ou_conteudo: "https://docs.python.org", data_upload: iso(addDays(-28)) },
  { id: "m4", curso_id: "c2", tipo: "documento", titulo: "Exercícios — Listas e Dicionários", url_ou_conteudo: "#", data_upload: iso(addDays(-10)) },
  { id: "m5", curso_id: "c3", tipo: "video", titulo: "Podcast — Daily Conversations", url_ou_conteudo: "#", data_upload: iso(addDays(-8)) },
  { id: "m6", curso_id: "c4", tipo: "pdf", titulo: "Resumo — Guerra Fria", url_ou_conteudo: "#", data_upload: iso(addDays(-5)) },
];

export const seedTarefas: Tarefa[] = [
  { id: "t1", titulo: "Resolver lista de derivadas", descricao: "Exercícios 1 a 15 do capítulo 4.", curso_id: "c1", prazo: iso(addHours(6)), prioridade: "alta", status: "em_andamento", data_criacao: iso(addDays(-3)), responsavel_id: ALUNO_ID },
  { id: "t2", titulo: "Projeto: API de tarefas em Flask", descricao: "Implementar CRUD e testes.", curso_id: "c2", prazo: iso(addDays(2)), prioridade: "alta", status: "pendente", data_criacao: iso(addDays(-4)), responsavel_id: ALUNO_ID },
  { id: "t3", titulo: "Assistir aula de listening", descricao: "Unidade 5 — Travel & Culture.", curso_id: "c3", prazo: iso(addDays(1)), prioridade: "media", status: "pendente", data_criacao: iso(addDays(-2)), responsavel_id: ALUNO_ID },
  { id: "t4", titulo: "Ler capítulo — Revolução Russa", descricao: "Capítulo 7, páginas 120–158.", curso_id: "c4", prazo: iso(addDays(-1)), prioridade: "media", status: "atrasada", data_criacao: iso(addDays(-6)), responsavel_id: ALUNO_ID },
  { id: "t5", titulo: "Revisar integrais", descricao: "Refazer exercícios errados na última prova.", curso_id: "c1", prazo: iso(addDays(5)), prioridade: "baixa", status: "pendente", data_criacao: iso(addDays(-1)), responsavel_id: ALUNO_ID },
  { id: "t6", titulo: "Entregar resumo — Python", descricao: "Resumo do capítulo de OOP.", curso_id: "c2", prazo: iso(addDays(-5)), prioridade: "media", status: "concluida", data_criacao: iso(addDays(-10)), responsavel_id: ALUNO_ID },
];

export const seedMetas: Meta[] = [
  { id: "meta-d", aluno_id: ALUNO_ID, tipo: "diaria", descricao: "Estudar todos os dias sem falhar.", horas_estudo_alvo: 4, horas_acumuladas: 2.5, data_inicio: iso(now), data_fim: iso(addHours(24 - now.getHours())), concluida: false },
  { id: "meta-s", aluno_id: ALUNO_ID, tipo: "semanal", descricao: "Consolidar rotina de estudos.", horas_estudo_alvo: 25, horas_acumuladas: 17.5, data_inicio: iso(addDays(-3)), data_fim: iso(addDays(4)), concluida: false },
  { id: "meta-m", aluno_id: ALUNO_ID, tipo: "mensal", descricao: "Preparação para as provas finais.", horas_estudo_alvo: 100, horas_acumuladas: 62, data_inicio: iso(addDays(-15)), data_fim: iso(addDays(15)), concluida: false },
];

function sessao(id: string, offsetDays: number, hour: number, minutes: number, tipo: "foco" | "pausa" = "foco", tarefa_id?: string): SessaoPomodoro {
  const start = new Date(now); start.setDate(start.getDate() + offsetDays); start.setHours(hour, 0, 0, 0);
  const end = new Date(start.getTime() + minutes * 60000);
  return { id, aluno_id: ALUNO_ID, tipo, duracao_minutos: minutes, inicio: iso(start), fim: iso(end), tarefa_id };
}

export const seedSessoes: SessaoPomodoro[] = [
  sessao("s1", 0, 8, 50, "foco", "t1"),
  sessao("s2", 0, 10, 25, "foco", "t2"),
  sessao("s3", 0, 14, 50, "foco", "t3"),
  sessao("s4", -1, 9, 50, "foco"),
  sessao("s5", -1, 15, 25, "foco"),
  sessao("s6", -2, 10, 50, "foco"),
  sessao("s7", -3, 8, 25, "foco"),
  sessao("s8", -3, 14, 50, "foco"),
  sessao("s9", -4, 9, 25, "foco"),
  sessao("s10", -5, 10, 50, "foco"),
  sessao("s11", -6, 15, 25, "foco"),
];

export const seedRevisoes: Revisao[] = [
  { id: "r1", aluno_id: ALUNO_ID, material_id: "m1", data_programada: iso(addHours(3)), status: "pendente", intervalo_dias: 1 },
  { id: "r2", aluno_id: ALUNO_ID, material_id: "m3", data_programada: iso(addDays(2)), status: "pendente", intervalo_dias: 7 },
  { id: "r3", aluno_id: ALUNO_ID, material_id: "m6", data_programada: iso(addDays(-1)), status: "atrasada", intervalo_dias: 1 },
  { id: "r4", aluno_id: ALUNO_ID, material_id: "m2", data_programada: iso(addDays(10)), status: "pendente", intervalo_dias: 30 },
  { id: "r5", aluno_id: ALUNO_ID, material_id: "m4", data_programada: iso(addDays(-3)), data_realizada: iso(addDays(-3)), status: "concluida", intervalo_dias: 7 },
];

export const seedNotificacoes: Notificacao[] = [
  { id: "n1", usuario_id: ALUNO_ID, mensagem: "Você tem uma revisão programada para hoje.", lida: false, data_criacao: iso(addHours(-1)), tipo: "revisao" },
  { id: "n2", usuario_id: ALUNO_ID, mensagem: "A tarefa 'Ler capítulo — Revolução Russa' está atrasada.", lida: false, data_criacao: iso(addHours(-4)), tipo: "tarefa" },
  { id: "n3", usuario_id: ALUNO_ID, mensagem: "Parabéns! Você atingiu 70% da meta semanal.", lida: true, data_criacao: iso(addDays(-1)), tipo: "meta" },
  { id: "n4", usuario_id: ALUNO_ID, mensagem: "Hora de fazer uma pausa. Descanse 5 minutos.", lida: true, data_criacao: iso(addDays(-1)), tipo: "pausa" },
];

export const seedRecomendacoes: RecomendacaoEstudo[] = [
  { id: "rec1", aluno_id: ALUNO_ID, mensagem: "Aumente 30 minutos de foco no período da manhã — é quando você rende mais.", baseada_em: "sessões de pomodoro", data_geracao: iso(addDays(-1)) },
  { id: "rec2", aluno_id: ALUNO_ID, mensagem: "Priorize revisões de Cálculo I; há 2 revisões pendentes.", baseada_em: "revisões atrasadas", data_geracao: iso(addDays(-1)) },
  { id: "rec3", aluno_id: ALUNO_ID, mensagem: "Você está próximo de bater a meta semanal — mantenha o ritmo!", baseada_em: "metas", data_geracao: iso(now) },
  { id: "rec4", aluno_id: ALUNO_ID, mensagem: "Que tal 15 min de listening em inglês antes de dormir?", baseada_em: "diagnóstico inicial", data_geracao: iso(addDays(-2)) },
];

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
