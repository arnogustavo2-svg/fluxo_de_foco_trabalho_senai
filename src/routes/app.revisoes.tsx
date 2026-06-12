import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useCollection } from "@/hooks/useCollection";
import * as db from "@/lib/firebase/firestore";
import { toast } from "sonner";

export const Route = createFileRoute("/app/revisoes")({
  head: () => ({ meta: [{ title: "Revisões — FocusEd" }] }),
  component: RevisoesPage,
});

function RevisoesPage() {
  const { data: revisoes, reload } = useCollection("revisoes");
  const { data: materiais } = useCollection("materiais");

  const today = new Date(); today.setHours(0,0,0,0);
  const hoje = revisoes.filter((r) => r.status === "pendente" && new Date(r.data_programada).toDateString() === new Date().toDateString());
  const atrasadas = revisoes.filter((r) => r.status === "atrasada");
  const futuras = revisoes.filter((r) => r.status === "pendente" && new Date(r.data_programada).getTime() > today.getTime() + 86400000);

  async function concluir(id: string) {
    await db.update("revisoes", id, { status: "concluida", data_realizada: new Date().toISOString() });
    toast.success("Revisão concluída! Próxima agendada.");
    void reload();
  }

  const Section = ({ title, items, tone }: { title: string; items: typeof revisoes; tone?: "danger" }) => (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="font-display text-base">{title} <span className="ml-1 text-sm font-normal text-muted-foreground">({items.length})</span></CardTitle></CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <EmptyState title="Nada por aqui" />}
        {items.map((r) => {
          const mat = materiais.find((m) => m.id === r.material_id);
          return (
            <div key={r.id} className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${tone === "danger" ? "border-destructive/30 bg-destructive/5" : "border-border bg-card"}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{r.intervalo_dias}d</Badge>
                  <span className="text-xs text-muted-foreground">{new Date(r.data_programada).toLocaleDateString("pt-BR")}</span>
                </div>
                <p className="mt-1 truncate text-sm font-medium">{mat?.titulo ?? "Material removido"}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => concluir(r.id)}>
                <CheckCircle2 className="mr-1 h-4 w-4" /> Concluir
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );

  return (
    <div>
      <PageHeader title="Revisões" description="Revisão espaçada: 1, 7 e 30 dias. Consolide o que aprendeu." actions={<Button variant="outline"><RotateCcw className="mr-2 h-4 w-4" /> Histórico</Button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="Hoje" items={hoje} />
        <Section title="Atrasadas" items={atrasadas} tone="danger" />
        <Section title="Futuras" items={futuras} />
      </div>
    </div>
  );
}