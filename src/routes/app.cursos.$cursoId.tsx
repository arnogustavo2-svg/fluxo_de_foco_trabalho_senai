import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, FileText, Film, Link2, FileQuestion } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/common/ProgressBar";
import { EmptyState } from "@/components/common/EmptyState";
import { useCollection } from "@/hooks/useCollection";
import type { MaterialType } from "@/types";

export const Route = createFileRoute("/app/cursos/$cursoId")({
  component: CursoDetalhe,
});

const ICON: Record<MaterialType, React.ComponentType<{ className?: string }>> = {
  pdf: FileText, video: Film, link: Link2, documento: FileQuestion,
};

function CursoDetalhe() {
  const { cursoId } = Route.useParams();
  const { data: cursos } = useCollection("cursos");
  const { data: materiais } = useCollection("materiais");
  const { data: tarefas } = useCollection("tarefas");
  const curso = cursos.find((c) => c.id === cursoId);

  if (!curso) {
    return <EmptyState title="Curso não encontrado" action={<Button asChild><Link to="/app/cursos">Voltar para cursos</Link></Button>} />;
  }

  const mats = materiais.filter((m) => m.curso_id === cursoId);
  const tasks = tarefas.filter((t) => t.curso_id === cursoId);

  return (
    <div className="space-y-6">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/cursos"><ArrowLeft className="mr-1 h-4 w-4" /> Cursos</Link>
      </Button>

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="h-32" style={{ background: `linear-gradient(135deg, ${curso.cor}, ${curso.cor}40)` }} />
        <div className="space-y-3 bg-card p-6">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{curso.titulo}</h1>
          <p className="text-sm text-muted-foreground">{curso.descricao}</p>
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <Badge variant="secondary">{mats.length} materiais</Badge>
            <Badge variant="secondary">{tasks.length} tarefas</Badge>
            <span className="ml-auto tabular-nums text-muted-foreground">{curso.progresso}% concluído</span>
          </div>
          <ProgressBar value={curso.progresso ?? 0} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-display">Materiais</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {mats.length === 0 && <EmptyState title="Sem materiais ainda" />}
            {mats.map((m) => {
              const Icon = ICON[m.tipo];
              return (
                <a key={m.id} href={m.url_ou_conteudo} target="_blank" rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition hover:border-primary/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{m.titulo}</div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">{m.tipo}</div>
                  </div>
                </a>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">Tarefas</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tasks.length === 0 && <EmptyState title="Sem tarefas" />}
            {tasks.map((t) => (
              <div key={t.id} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 text-xs">
                  <Badge variant={t.status === "concluida" ? "secondary" : t.status === "atrasada" ? "destructive" : "outline"} className="capitalize">
                    {t.status.replace("_", " ")}
                  </Badge>
                  <span className="text-muted-foreground">{new Date(t.prazo).toLocaleDateString("pt-BR")}</span>
                </div>
                <p className="mt-1 text-sm font-medium">{t.titulo}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}