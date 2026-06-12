import { cn } from "@/lib/utils";

interface Props {
  value: number; // 0-100
  className?: string;
  tone?: "primary" | "success" | "warning" | "danger";
}

export function ProgressBar({ value, className, tone = "primary" }: Props) {
  const v = Math.max(0, Math.min(100, value));
  const bg = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-destructive",
  }[tone];
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", bg)} style={{ width: `${v}%` }} />
    </div>
  );
}