import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, BookOpen, ListChecks, Target, Timer, RotateCcw, BarChart3, User as UserIcon, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/cursos", label: "Cursos", icon: BookOpen },
  { to: "/app/tarefas", label: "Tarefas", icon: ListChecks },
  { to: "/app/metas", label: "Metas", icon: Target },
  { to: "/app/pomodoro", label: "Pomodoro", icon: Timer, highlight: true },
  { to: "/app/revisoes", label: "Revisões", icon: RotateCcw },
  { to: "/app/estatisticas", label: "Estatísticas", icon: BarChart3 },
  { to: "/app/notificacoes", label: "Notificações", icon: Bell },
  { to: "/app/perfil", label: "Perfil", icon: UserIcon },
] as const;

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Timer className="h-4 w-4" />
        </div>
        <span className="font-display text-lg font-semibold tracking-tight">FocusEd</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {items.map((item) => {
          const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                item.highlight && !active && "text-primary",
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-current")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-primary/5 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Dica</p>
          <p className="mt-1">Após 4 ciclos de foco, faça uma pausa longa de 15–30 minutos.</p>
        </div>
      </div>
    </aside>
  );
}