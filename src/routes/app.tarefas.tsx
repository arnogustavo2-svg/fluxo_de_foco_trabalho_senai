import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useCollection } from "@/hooks/useCollection";
import * as db from "@/lib/firebase/firestore";
import { toast } from "sonner";
import type { TaskStatus, TaskPriority } from "@/types";

export const Route = createFileRoute("/app/tarefas")({
  head: () => ({ meta: [{ title: "Tarefas — FocusEd" }] }),
  component: TarefasPage,
});

const FILTERS: { value: "todas" | TaskStatus; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "pendente", label: "Pendentes" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluídas" },
  { value: "atrasada", label: "Atrasadas" },
];

const priorityTone: Record<TaskPriority, "secondary" | "default" | "destructive"> = {
  baixa: "secondary", media: "default", alta: "destructive",
};

function TarefasPage() {
  const { data: tarefas, reload } = useCollection("tarefas");
  const { data: cursos } = useCollection("cursos");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["value"]>("todas");

  const filtered = useMemo(() => {
    const list = filter === "todas" ? tarefas : tarefas.filter((t) => t.status === filter);
    return [...list].sort((a, b) => +new Date(a.prazo) - +new Date(b.prazo));
  }, [tarefas, filter]);

  async function toggle(id: string, status: TaskStatus) {
    const next: TaskStatus = status === "concluida" ? "pendente" : "concluida";
    await db.update("tarefas", id, { status: next });
    toast.success(next === "concluida" ? "Tarefa concluída! 🎉" : "Tarefa reaberta");
    void reload();
  }

  return (
    <div>
      <PageHeader title="Tarefas" description="Filtre, priorize e marque tarefas como concluídas." />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-5">
        <TabsList>
          {FILTERS.map((f) => <TabsTrigger key={f.value} value={f.value}>{f.label}</TabsTrigger>)}
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        {filtered.length === 0 && <EmptyState title="Sem tarefas nesta categoria" />}
        {filtered.map((t) => {
          const curso = cursos.find((c) => c.id === t.curso_id);
          const done = t.status === "concluida";
          const late = t.status === "atrasada";
          return (
            <Card key={t.id} className={late ? "border-destructive/30" : ""}>
              <CardContent className="flex items-start gap-3 p-4">
                <Button variant="ghost" size="icon" onClick={() => toggle(t.id, t.status)} aria-label="Alternar conclusão">
                  {done ? <CheckCircle2 className="h-5 w-5 text-success" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                </Button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={priorityTone[t.prioridade]} className="capitalize">{t.prioridade}</Badge>
                    {curso && <Badge variant="outline" style={{ borderColor: curso.cor, color: curso.cor }}>{curso.titulo}</Badge>}
                    {late ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-destructive"><AlertCircle className="h-3 w-3" /> Atrasada</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {new Date(t.prazo).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</span>
                    )}
                  </div>
                  <p className={`mt-1 font-medium ${done ? "line-through text-muted-foreground" : ""}`}>{t.titulo}</p>
                  <p className="text-sm text-muted-foreground">{t.descricao}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}