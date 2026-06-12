import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();
  useEffect(() => {
    if (loading) return;
    router.navigate({ to: user ? "/app" : "/auth/login", replace: true });
  }, [user, loading, router]);
  return (
    <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
      Redirecionando…
    </div>
  );
}
