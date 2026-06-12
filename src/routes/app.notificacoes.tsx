import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, RotateCcw, Target, Timer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { useCollection } from "@/hooks/useCollection";
import * as db from "@/lib/firebase/firestore";

export const Route = createFileRoute("/app/notificacoes")({
  head: () => ({ meta: [{ title: "Notificações — FocusEd" }] }),
  component: NotificacoesPage,
});

const ICON = { tarefa: Check, revisao: RotateCcw, meta: Target, pausa: Timer, sistema: Bell } as const;

function NotificacoesPage() {
  const { data, reload } = useCollection("notificacoes");
  const sorted = [...data].sort((a, b) => +new Date(b.data_criacao) - +new Date(a.data_criacao));

  async function marcarLida(id: string) {
    await db.update("notificacoes", id, { lida: true });
    void reload();
  }
  async function marcarTodas() {
    await Promise.all(data.filter((n) => !n.lida).map((n) => db.update("notificacoes", n.id, { lida: true })));
    void reload();
  }

  return (
    <div>
      <PageHeader title="Notificações" actions={<Button variant="outline" onClick={marcarTodas}>Marcar todas como lidas</Button>} />
      <div className="space-y-2">
        {sorted.length === 0 && <EmptyState icon={<Bell className="h-5 w-5" />} title="Nenhuma notificação" />}
        {sorted.map((n) => {
          const Icon = ICON[n.tipo];
          return (
            <Card key={n.id} className={n.lida ? "" : "border-primary/30 bg-primary/5"}>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{n.mensagem}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="capitalize">{n.tipo}</Badge>
                    <span>{new Date(n.data_criacao).toLocaleString("pt-BR")}</span>
                  </div>
                </div>
                {!n.lida && <Button size="sm" variant="ghost" onClick={() => marcarLida(n.id)}>Marcar lida</Button>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}