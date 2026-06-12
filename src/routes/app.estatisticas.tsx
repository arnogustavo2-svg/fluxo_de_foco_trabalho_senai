import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { useCollection } from "@/hooks/useCollection";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Clock, Flame, Target, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/app/estatisticas")({
  head: () => ({ meta: [{ title: "Estatísticas — FocusEd" }] }),
  component: EstatisticasPage,
});

const semana = [
  { dia: "Seg", horas: 1.5 },
  { dia: "Ter", horas: 2.2 },
  { dia: "Qua", horas: 1.8 },
  { dia: "Qui", horas: 3.1 },
  { dia: "Sex", horas: 2.4 },
  { dia: "Sáb", horas: 0.9 },
  { dia: "Dom", horas: 1.7 },
];
const mensal = Array.from({ length: 30 }, (_, i) => ({ dia: i + 1, horas: +(Math.random() * 4).toFixed(1) }));

function EstatisticasPage() {
  const { data: sessoes } = useCollection("sessoes_pomodoro");
  const totalHoras = sessoes.filter((s) => s.tipo === "foco").reduce((a, s) => a + s.duracao_minutos, 0) / 60;

  return (
    <div className="space-y-6">
      <PageHeader title="Estatísticas" description="Veja sua evolução em horas estudadas, produtividade e sequência." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total estudado" value={`${totalHoras.toFixed(1)}h`} icon={<Clock className="h-5 w-5" />} tone="primary" />
        <StatCard label="Sequência atual" value="12d" icon={<Flame className="h-5 w-5" />} tone="warning" />
        <StatCard label="Metas batidas" value="8" hint="últimos 30 dias" icon={<Target className="h-5 w-5" />} tone="success" />
        <StatCard label="Produtividade" value="82%" hint="+12% no mês" icon={<TrendingUp className="h-5 w-5" />} tone="primary" />
      </div>

      <Card>
        <CardHeader><CardTitle className="font-display text-base">Horas por dia — esta semana</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={semana}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="horas" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-display text-base">Evolução — últimos 30 dias</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mensal}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="dia" stroke="var(--color-muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="horas" stroke="var(--color-primary)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}