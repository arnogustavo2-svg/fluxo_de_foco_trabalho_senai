import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/common/ProgressBar";
import { PageHeader } from "@/components/common/PageHeader";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/app/metas")({
  head: () => ({ meta: [{ title: "Metas — FocusEd" }] }),
  component: MetasPage,
});

function MetasPage() {
  const { data: metas } = useCollection("metas");
  const order = { diaria: 0, semanal: 1, mensal: 2 } as const;
  const sorted = [...metas].sort((a, b) => order[a.tipo] - order[b.tipo]);

  return (
    <div>
      <PageHeader
        title="Metas"
        description="Defina objetivos claros e acompanhe seu progresso."
        actions={<Button><Target className="mr-2 h-4 w-4" /> Nova meta</Button>}
      />

      <div className="grid gap-4 md:grid-cols-3">
        {sorted.map((m) => {
          const pct = Math.round((m.horas_acumuladas / m.horas_estudo_alvo) * 100);
          const done = pct >= 100;
          return (
            <Card key={m.id} className={done ? "border-success/40" : ""}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display capitalize">Meta {m.tipo}</CardTitle>
                  {done && <CheckCircle2 className="h-5 w-5 text-success" />}
                </div>
                <p className="text-sm text-muted-foreground">{m.descricao}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-end justify-between">
                  <span className="font-display text-3xl font-semibold tabular-nums">{m.horas_acumuladas.toFixed(1)}h</span>
                  <span className="text-sm text-muted-foreground">de {m.horas_estudo_alvo}h</span>
                </div>
                <ProgressBar value={pct} tone={done ? "success" : "primary"} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{new Date(m.data_inicio).toLocaleDateString("pt-BR")}</span>
                  <span>{new Date(m.data_fim).toLocaleDateString("pt-BR")}</span>
                </div>
                {done && (
                  <div className="rounded-md bg-success/10 px-3 py-2 text-xs font-medium text-success">
                    Parabéns! Meta concluída. 🎉
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}