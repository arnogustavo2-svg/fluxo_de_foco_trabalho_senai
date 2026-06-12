import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { PageHeader } from "@/components/common/PageHeader";
import { useCollection } from "@/hooks/useCollection";

export const Route = createFileRoute("/app/cursos/")({
  head: () => ({ meta: [{ title: "Cursos — FocusEd" }] }),
  component: CursosPage,
});

function CursosPage() {
  const { data: cursos } = useCollection("cursos");
  const { data: materiais } = useCollection("materiais");
  const [q, setQ] = useState("");
  const filtered = useMemo(() => cursos.filter((c) => c.titulo.toLowerCase().includes(q.toLowerCase())), [cursos, q]);

  return (
    <div>
      <PageHeader title="Cursos" description="Acompanhe seu progresso em cada curso e acesse os materiais." />
      <div className="relative mb-5 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar cursos…" className="pl-9" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => {
          const count = materiais.filter((m) => m.curso_id === c.id).length;
          return (
            <Link key={c.id} to="/app/cursos/$cursoId" params={{ cursoId: c.id }}>
              <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
                <div className="h-24 rounded-t-xl" style={{ background: `linear-gradient(135deg, ${c.cor}, ${c.cor}40)` }} />
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-lg font-semibold leading-tight">{c.titulo}</h3>
                    <Badge variant="secondary"><BookOpen className="mr-1 h-3 w-3" />{count}</Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{c.descricao}</p>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progresso</span><span className="tabular-nums">{c.progresso}%</span>
                    </div>
                    <ProgressBar value={c.progresso ?? 0} className="mt-1" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}