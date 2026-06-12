import type {
  User, Curso, Material, Tarefa, Meta, SessaoPomodoro,
  Revisao, Notificacao, RecomendacaoEstudo,
} from "@/types";

const now = new Date();
const iso = (d: Date) => d.toISOString();
const days = (n: number) => {
  const d = new Date(now); d.setDate(d.getDate() + n); return d;
};
const hours = (n: number) => {
  const d = new Date(now); d.setHours(d.getHours() + n); return d;
};

export const seedUser: User = {
  id: "u-aluno-1",
  nome: "Ana Beatriz",
  email: "ana@focused.app",
  role: "aluno",
  data_criacao: iso(days(-90)),
  consentimento_lgpd: true,
};

const ADMIN_ID = "u-admin-1";

export const seedCursos: Curso[] = [
  { id: "c-1", titulo: "Desenvolvimento Web Full-Stack", descricao: "HTML, CSS, JavaScript, React, Node e bancos de dados.", criador_id: ADMIN_ID, data_criacao: iso(days(-80)), ativo: true, progresso: 64, cor: "#2563EB" },
  { id: "c-2", titulo: "Inglês Técnico para TI", descricao: "Leitura de documentação, reuniões e escrita técnica.", criador_id: ADMIN_ID, data_criacao: iso(days(-60)), ativo: true, progresso: 38, cor: "#22C55E" },
  { id: "c-3", titulo: "Banco de Dados SQL", descricao: "Modelagem, consultas, normalização e tuning.", criador_id: ADMIN_ID, data_criacao: iso(days(-45)), ativo: true, progresso: 22, cor: "#F59E0B" },
  { id: "c-4", titulo: "UX para Desenvolvedores", descricao: "Princípios de usabilidade, heurísticas e acessibilidade.", criador_id: ADMIN_ID, data_criacao: iso(days(-30)), ativo: true, progresso: 12, cor: "#7C3AED" },
];

export const seedMateriais: Material[] = [
  { id: "m-1", curso_id: "c-1", tipo: "video", titulo: "Aula 04 — Hooks no React", url_ou_conteudo: "https://example.com/aula-04", data_upload: iso(days(-7)) },
  { id: "m-2", curso_id: "c-1", tipo: "pdf", titulo: "Apostila: Componentes e Props", url_ou_conteudo: "https://example.com/apostila.pdf", data_upload: iso(days(-10)) },
  { id: "m-3", curso_id: "c-1", tipo: "link", titulo: "Documentação React (oficial)", url_ou_conteudo: "https://react.dev", data_upload: iso(days(-20)) },
  { id: "m-4", curso_id: "c-2", tipo: "documento", titulo: "Glossário técnico EN-PT", url_ou_conteudo: "Lista de termos…", data_upload: iso(days(-5)) },
  { id: "m-5", curso_id: "c-2", tipo: "video", titulo: "Daily meetings — vocabulário", url_ou_conteudo: "https://example.com/daily", data_upload: iso(days(-3)) },
  { id: "m-6", curso_id: "c-3", tipo: "pdf", titulo: "Modelagem relacional — guia rápido", url_ou_conteudo: "https://example.com/sql.pdf", data_upload: iso(days(-9)) },
  { id: "m-7", curso_id: "c-4", tipo: "video", titulo: "Heurísticas de Nielsen explicadas", url_ou_conteudo: "https://example.com/ux", data_upload: iso(days(-2)) },
];

export const seedTarefas: Tarefa[] = [
  { id: "t-1", titulo: "Exercícios de Hooks", descricao: "Resolver 8 desafios de useEffect e useMemo.", curso_id: "c-1", prazo: iso(hours(6)), prioridade: "alta", status: "em_andamento", data_criacao: iso(days(-2)), responsavel_id: seedUser.id },
  { id: "t-2", titulo: "Projeto Final — Wireframe", descricao: "Criar wireframe de baixa fidelidade do dashboard.", curso_id: "c-4", prazo: iso(days(2)), prioridade: "media", status: "pendente", data_criacao: iso(days(-1)), responsavel_id: seedUser.id },
  { id: "t-3", titulo: "Lista 03 — JOINs", descricao: "Resolver consultas com INNER, LEFT e RIGHT JOIN.", curso_id: "c-3", prazo: iso(days(5)), prioridade: "media", status: "pendente", data_criacao: iso(days(-3)), responsavel_id: seedUser.id },
  { id: "t-4", titulo: "Resumo: Heurísticas de Nielsen", descricao: "Resumir em 1 página as 10 heurísticas.", curso_id: "c-4", prazo: iso(days(-1)), prioridade: "baixa", status: "atrasada", data_criacao: iso(days(-7)), responsavel_id: seedUser.id },
  { id: "t-5", titulo: "Leitura técnica em inglês", descricao: "Ler artigo sobre arquitetura limpa.", curso_id: "c-2", prazo: iso(days(-3)), prioridade: "baixa", status: "concluida", data_criacao: iso(days(-10)), responsavel_id: seedUser.id },
  { id: "t-6", titulo: "Estudo dirigido: Context API", descricao: "Implementar tema escuro com Context.", curso_id: "c-1", prazo: iso(days(7)), prioridade: "alta", status: "pendente", data_criacao: iso(days(-1)), responsavel_id: seedUser.id },
];

export const seedMetas: Meta[] = [
  { id: "g-1", aluno_id: seedUser.id, tipo: "diaria", descricao: "Estudar todos os dias", horas_estudo_alvo: 2, horas_acumuladas: 1.3, data_inicio: iso(now), data_fim: iso(now), concluida: false },
  { id: "g-2", aluno_id: seedUser.id, tipo: "semanal", descricao: "10 horas de foco na semana", horas_estudo_alvo: 10, horas_acumuladas: 6.5, data_inicio: iso(days(-3)), data_fim: iso(days(4)), concluida: false },
  { id: "g-3", aluno_id: seedUser.id, tipo: "mensal", descricao: "40 horas no mês", horas_estudo_alvo: 40, horas_acumuladas: 22.5, data_inicio: iso(days(-12)), data_fim: iso(days(18)), concluida: false },
];

export const seedSessoes: SessaoPomodoro[] = [
  { id: "p-1", aluno_id: seedUser.id, tipo: "foco", duracao_minutos: 25, inicio: iso(hours(-2)), fim: iso(hours(-1.5)), tarefa_id: "t-1" },
  { id: "p-2", aluno_id: seedUser.id, tipo: "pausa", duracao_minutos: 5, inicio: iso(hours(-1.4)), fim: iso(hours(-1.3)) },
  { id: "p-3", aluno_id: seedUser.id, tipo: "foco", duracao_minutos: 25, inicio: iso(hours(-1)), fim: iso(hours(-0.5)), tarefa_id: "t-1" },
];

export const seedRevisoes: Revisao[] = [
  { id: "r-1", aluno_id: seedUser.id, material_id: "m-1", data_programada: iso(now), status: "pendente", intervalo_dias: 1 },
  { id: "r-2", aluno_id: seedUser.id, material_id: "m-3", data_programada: iso(days(2)), status: "pendente", intervalo_dias: 7 },
  { id: "r-3", aluno_id: seedUser.id, material_id: "m-6", data_programada: iso(days(-2)), status: "atrasada", intervalo_dias: 7 },
  { id: "r-4", aluno_id: seedUser.id, material_id: "m-4", data_programada: iso(days(14)), status: "pendente", intervalo_dias: 30 },
  { id: "r-5", aluno_id: seedUser.id, material_id: "m-2", data_programada: iso(days(-5)), data_realizada: iso(days(-5)), status: "concluida", intervalo_dias: 1 },
];

export const seedNotificacoes: Notificacao[] = [
  { id: "n-1", usuario_id: seedUser.id, mensagem: "Você tem uma revisão pendente hoje: Hooks no React.", lida: false, data_criacao: iso(hours(-3)), tipo: "revisao" },
  { id: "n-2", usuario_id: seedUser.id, mensagem: "Tarefa “Exercícios de Hooks” vence em 6 horas.", lida: false, data_criacao: iso(hours(-2)), tipo: "tarefa" },
  { id: "n-3", usuario_id: seedUser.id, mensagem: "Boa! Você completou 65% da meta semanal.", lida: true, data_criacao: iso(hours(-20)), tipo: "meta" },
  { id: "n-4", usuario_id: seedUser.id, mensagem: "Lembrete: faça uma pausa a cada 4 ciclos de foco.", lida: true, data_criacao: iso(days(-1)), tipo: "pausa" },
];

export const seedRecomendacoes: RecomendacaoEstudo[] = [
  { id: "rec-1", aluno_id: seedUser.id, mensagem: "Concentre-se em revisões atrasadas antes de iniciar novos tópicos.", baseada_em: "métricas", data_geracao: iso(hours(-12)) },
  { id: "rec-2", aluno_id: seedUser.id, mensagem: "Seu pico de foco é pela manhã — agende Pomodoros antes das 11h.", baseada_em: "diagnóstico", data_geracao: iso(days(-1)) },
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