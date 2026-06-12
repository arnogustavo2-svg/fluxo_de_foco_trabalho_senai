import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ArrowRight, BookOpen, Clock, Flame, ListChecks, RotateCcw, Target, Timer, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ProgressRing } from "@/components/common/ProgressRing";
import { StatCard } from "@/components/common/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/app/")({
  head: () => ({ meta: [{ title: "Dashboard — FocusEd" }] }),
  component: DashboardPage,
});

function saudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

function DashboardPage() {
  const { user } = useAuth();
  const { data: cursos } = useCollection("cursos");
  const { data: tarefas } = useCollection("tarefas");
  const { data: metas } = useCollection("metas");
  const { data: revisoes } = useCollection("revisoes");
  const { data: sessoes } = useCollection("sessoes_pomodoro");
  const { data: recs } = useCollection("recomendacoes");

  const metaDiaria = metas.find((m) => m.tipo === "diaria");
  const metaSemanal = metas.find((m) => m.tipo === "semanal");

  const horasHoje = useMemo(() => {
    const today = new Date().toDateString();
    const mins = sessoes
      .filter((s) => s.tipo === "foco" && new Date(s.inicio).toDateString() === today)
      .reduce((acc, s) => acc + s.duracao_minutos, 0);
    return mins / 60;
  }, [sessoes]);

  const proximaTarefa = useMemo(() => {
    return [...tarefas]
      .filter((t) => t.status !== "concluida")
      .sort((a, b) => +new Date(a.prazo) - +new Date(b.prazo))[0];
  }, [tarefas]);

  const proximaRevisao = useMemo(() => {
    return [...revisoes]
      .filter((r) => r.status !== "concluida")
      .sort((a, b) => +new Date(a.data_programada) - +new Date(b.data_programada))[0];
  }, [revisoes]);

  const pendentes = tarefas.filter((t) => t.status === "pendente" || t.status === "em_andamento").length;
  const revPend = revisoes.filter((r) => r.status !== "concluida").length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">{saudacao()},</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {user?.nome?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Você está em uma sequência de <span className="font-medium text-foreground">12 dias</span> de estudo. Continue assim!
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline"><Link to="/app/tarefas">Ver tarefas</Link></Button>
          <Button asChild><Link to="/app/pomodoro"><Timer className="mr-2 h-4 w-4" /> Iniciar Pomodoro</Link></Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Horas hoje" value={horasHoje.toFixed(1) + "h"} hint={`Meta: ${metaDiaria?.horas_estudo_alvo ?? 0}h`} icon={<Clock className="h-5 w-5" />} tone="primary" />
        <StatCard label="Sequência" value="12d" hint="Recorde: 18 dias" icon={<Flame className="h-5 w-5" />} tone="warning" />
        <StatCard label="Tarefas pendentes" value={pendentes} hint={`${tarefas.filter((t) => t.status === "atrasada").length} atrasadas`} icon={<ListChecks className="h-5 w-5" />} tone="danger" />
        <StatCard label="Revisões" value={revPend} hint="hoje + futuras" icon={<RotateCcw className="h-5 w-5" />} tone="success" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-display">Progresso de metas</CardTitle>
              <p className="text-sm text-muted-foreground">Acompanhe diária, semanal e mensal.</p>
            </div>
            <Button asChild variant="ghost" size="sm"><Link to="/app/metas">Ver todas <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-5">
            {metas.map((m) => {
              const pct = Math.round((m.horas_acumuladas / m.horas_estudo_alvo) * 100);
              return (
                <div key={m.id}>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium capitalize">Meta {m.tipo}</span>
                      <span className="ml-2 text-muted-foreground">{m.descricao}</span>
                    </div>
                    <span className="tabular-nums text-muted-foreground">
                      {m.horas_acumuladas.toFixed(1)}h / {m.horas_estudo_alvo}h
                    </span>
                  </div>
                  <ProgressBar value={pct} className="mt-2" tone={pct >= 100 ? "success" : "primary"} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Produtividade da semana</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ProgressRing value={Math.round(((metaSemanal?.horas_acumuladas ?? 0) / (metaSemanal?.horas_estudo_alvo ?? 1)) * 100)} label={`${Math.round(((metaSemanal?.horas_acumuladas ?? 0) / (metaSemanal?.horas_estudo_alvo ?? 1)) * 100)}%`} sublabel="da meta semanal" />
            <div className="mt-4 flex items-center gap-2 text-sm text-success">
              <TrendingUp className="h-4 w-4" /> +18% vs semana anterior
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="font-display text-base">Próxima tarefa</CardTitle></CardHeader>
          <CardContent>
            {proximaTarefa ? (
              <Link to="/app/tarefas" className="block rounded-lg border border-border p-4 transition hover:border-primary/50">
                <div className="flex items-center gap-2">
                  <Badge variant={proximaTarefa.prioridade === "alta" ? "destructive" : "secondary"} className="capitalize">{proximaTarefa.prioridade}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(proximaTarefa.prazo).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                </div>
                <p className="mt-2 font-medium">{proximaTarefa.titulo}</p>
                <p className="text-sm text-muted-foreground">{proximaTarefa.descricao}</p>
              </Link>
            ) : <p className="text-sm text-muted-foreground">Sem tarefas pendentes. 🎉</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display text-base">Próxima revisão</CardTitle></CardHeader>
          <CardContent>
            {proximaRevisao ? (
              <Link to="/app/revisoes" className="block rounded-lg border border-border p-4 transition hover:border-primary/50">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{proximaRevisao.intervalo_dias}d</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(proximaRevisao.data_programada).toLocaleDateString("pt-BR")}
                  </span>
                </div>
                <p className="mt-2 font-medium">Revisão programada</p>
                <p className="text-sm text-muted-foreground">Material #{proximaRevisao.material_id}</p>
              </Link>
            ) : <p className="text-sm text-muted-foreground">Nenhuma revisão pendente.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-base">Meus cursos</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/app/cursos">Todos</Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {cursos.slice(0, 3).map((c) => (
              <Link key={c.id} to="/app/cursos/$cursoId" params={{ cursoId: c.id }} className="block">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: c.cor }} />
                    <span className="truncate text-sm font-medium">{c.titulo}</span>
                  </div>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">{c.progresso}%</span>
                </div>
                <ProgressBar value={c.progresso ?? 0} className="mt-1.5" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-base">Recomendações para você</CardTitle>
          <p className="text-sm text-muted-foreground">Geradas a partir do seu diagnóstico e métricas.</p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {recs.map((r) => (
            <div key={r.id} className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground">{r.mensagem}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">Baseada em: {r.baseada_em}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <BookOpen className="h-3.5 w-3.5" /> <Target className="h-3.5 w-3.5" /> A consistência vence a intensidade.
      </p>
    </div>
  );
}