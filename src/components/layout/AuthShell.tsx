import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Timer } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-10 sm:px-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Timer className="h-4 w-4" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">FocusEd</span>
        </Link>

        <div className="mx-auto my-auto w-full max-w-sm py-10">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary via-primary to-[oklch(0.4_0.18_263)] lg:block">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, white 0, transparent 40%), radial-gradient(circle at 70% 80%, white 0, transparent 35%)" }} />
        <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
          <div className="max-w-md">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-medium">Para estudantes técnicos</span>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">
              Foco, organização e evolução em uma única plataforma.
            </h2>
            <p className="mt-3 text-sm text-white/80">
              Gerencie cursos, tarefas e metas, mantenha o ritmo com Pomodoro e
              consolide o conhecimento com revisões espaçadas.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="rounded-lg bg-white/10 p-4"><div className="font-display text-2xl font-semibold">25min</div><div className="mt-1 text-white/70">ciclo de foco</div></div>
            <div className="rounded-lg bg-white/10 p-4"><div className="font-display text-2xl font-semibold">1·7·30</div><div className="mt-1 text-white/70">revisão espaçada</div></div>
            <div className="rounded-lg bg-white/10 p-4"><div className="font-display text-2xl font-semibold">🔥</div><div className="mt-1 text-white/70">sequência diária</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}