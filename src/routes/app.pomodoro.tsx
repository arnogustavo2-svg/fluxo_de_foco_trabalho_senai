import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, RefreshCw, SkipForward, Maximize2, Minimize2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/PageHeader";
import { useCollection } from "@/hooks/useCollection";
import * as db from "@/lib/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/pomodoro")({
  head: () => ({ meta: [{ title: "Pomodoro — FocusEd" }] }),
  component: PomodoroPage,
});

type Mode = "foco" | "pausa_curta" | "pausa_longa";
const DURATIONS: Record<Mode, number> = { foco: 25 * 60, pausa_curta: 5 * 60, pausa_longa: 20 * 60 };
const LABEL: Record<Mode, string> = { foco: "Foco", pausa_curta: "Pausa curta", pausa_longa: "Pausa longa" };

function fmt(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = (s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
}

function PomodoroPage() {
  const { user } = useAuth();
  const { data: tarefas } = useCollection("tarefas");
  const { data: sessoes, reload } = useCollection("sessoes_pomodoro");

  const [mode, setMode] = useState<Mode>("foco");
  const [remaining, setRemaining] = useState(DURATIONS.foco);
  const [running, setRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [tarefaId, setTarefaId] = useState<string | undefined>(undefined);
  const startedAt = useRef<Date | null>(null);

  useEffect(() => { setRemaining(DURATIONS[mode]); }, [mode]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { clearInterval(id); void onComplete(); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, mode]);

  async function onComplete() {
    setRunning(false);
    const fim = new Date();
    const inicio = startedAt.current ?? new Date(fim.getTime() - DURATIONS[mode] * 1000);
    if (user) {
      await db.create("sessoes_pomodoro", {
        id: crypto.randomUUID(),
        aluno_id: user.id,
        tipo: mode === "foco" ? "foco" : "pausa",
        duracao_minutos: DURATIONS[mode] / 60,
        inicio: inicio.toISOString(),
        fim: fim.toISOString(),
        tarefa_id: tarefaId,
      });
    }
    void reload();
    if (mode === "foco") {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      const next: Mode = newCycles % 4 === 0 ? "pausa_longa" : "pausa_curta";
      toast.success(`Ciclo ${newCycles} concluído! Hora da ${next === "pausa_longa" ? "pausa longa" : "pausa"}.`);
      setMode(next);
    } else {
      toast("Pausa terminada. Vamos voltar ao foco.");
      setMode("foco");
    }
    startedAt.current = null;
  }

  function start() {
    if (!startedAt.current) startedAt.current = new Date();
    setRunning(true);
  }
  function pause() { setRunning(false); }
  function reset() { setRunning(false); setRemaining(DURATIONS[mode]); startedAt.current = null; }

  const pct = useMemo(() => 1 - remaining / DURATIONS[mode], [remaining, mode]);
  const size = focusMode ? 360 : 280;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const totaisHoje = sessoes
    .filter((s) => s.tipo === "foco" && new Date(s.inicio).toDateString() === new Date().toDateString())
    .reduce((acc, s) => acc + s.duracao_minutos, 0);

  return (
    <div className={cn(focusMode && "fixed inset-0 z-50 overflow-auto bg-background")}>
      {!focusMode && (
        <PageHeader
          title="Pomodoro"
          description="Foque por 25 min, descanse por 5. A cada 4 ciclos, faça uma pausa longa."
          actions={<Button variant="outline" onClick={() => setFocusMode(true)}><Maximize2 className="mr-2 h-4 w-4" /> Modo foco</Button>}
        />
      )}

      <div className={cn("grid gap-6", focusMode ? "place-items-center p-8" : "lg:grid-cols-3")}>
        <Card className={cn(focusMode ? "border-0 bg-transparent shadow-none" : "lg:col-span-2")}>
          <CardContent className={cn("flex flex-col items-center gap-6", focusMode ? "p-0" : "p-8")}>
            <div className="flex gap-2">
              {(["foco", "pausa_curta", "pausa_longa"] as Mode[]).map((m) => (
                <Button key={m} variant={mode === m ? "default" : "outline"} size="sm" onClick={() => { setMode(m); setRunning(false); }}>
                  {LABEL[m]}
                </Button>
              ))}
            </div>

            <div className="relative" style={{ width: size, height: size }}>
              <svg width={size} height={size} className="-rotate-90">
                <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
                <circle cx={size/2} cy={size/2} r={r} strokeWidth={stroke}
                  className={cn("fill-none transition-[stroke-dashoffset] duration-1000", mode === "foco" ? "stroke-primary" : "stroke-success")}
                  strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{LABEL[mode]}</span>
                <span className="font-display text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl">{fmt(remaining)}</span>
                <span className="mt-1 text-xs text-muted-foreground">Ciclo {cycles + (running ? 1 : 0)} · {totaisHoje} min hoje</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {running ? (
                <Button size="lg" onClick={pause}><Pause className="mr-2 h-4 w-4" /> Pausar</Button>
              ) : (
                <Button size="lg" onClick={start}><Play className="mr-2 h-4 w-4" /> Iniciar</Button>
              )}
              <Button size="lg" variant="outline" onClick={reset}><RefreshCw className="mr-2 h-4 w-4" /> Reiniciar</Button>
              <Button size="lg" variant="outline" onClick={() => onComplete()}><SkipForward className="mr-2 h-4 w-4" /> Finalizar</Button>
            </div>

            {focusMode && (
              <Button variant="ghost" size="sm" onClick={() => setFocusMode(false)}>
                <Minimize2 className="mr-2 h-4 w-4" /> Sair do modo foco
              </Button>
            )}
          </CardContent>
        </Card>

        {!focusMode && (
          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="font-display text-base">Sessão atual</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-muted-foreground">Tarefa associada (opcional)</label>
                <select
                  value={tarefaId ?? ""}
                  onChange={(e) => setTarefaId(e.target.value || undefined)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Nenhuma</option>
                  {tarefas.filter((t) => t.status !== "concluida").map((t) => (
                    <option key={t.id} value={t.id}>{t.titulo}</option>
                  ))}
                </select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-display text-base">Estatísticas rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Minutos hoje</span><span className="font-medium tabular-nums">{totaisHoje} min</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Ciclos completos</span><span className="font-medium tabular-nums">{cycles}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Sessões totais</span><span className="font-medium tabular-nums">{sessoes.filter((s) => s.tipo === "foco").length}</span></div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="font-display text-base">Histórico recente</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {sessoes.slice(-5).reverse().map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge variant={s.tipo === "foco" ? "default" : "secondary"} className="capitalize">{s.tipo}</Badge>
                      <span className="text-muted-foreground">{new Date(s.inicio).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <span className="tabular-nums text-muted-foreground">{s.duracao_minutos} min</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}