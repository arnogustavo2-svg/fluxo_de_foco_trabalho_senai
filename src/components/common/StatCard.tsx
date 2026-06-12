import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  icon?: ReactNode;
  tone?: "primary" | "success" | "warning" | "danger" | "neutral";
  className?: string;
}

const toneMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const;

export function StatCard({ label, value, hint, icon, tone = "primary", className }: Props) {
  return (
    <Card className={cn("border-border/60 shadow-sm", className)}>
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">{value}</div>
          {hint && <div className="mt-1 text-sm text-muted-foreground">{hint}</div>}
        </div>
        {icon && <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", toneMap[tone])}>{icon}</div>}
      </CardContent>
    </Card>
  );
}