import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/login")({
  head: () => ({ meta: [{ title: "Entrar — FocusEd" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Preencha email e senha");
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Bem-vinda de volta!");
      router.navigate({ to: "/app" });
    } finally { setLoading(false); }
  }

  return (
    <AuthShell
      title="Entrar na sua conta"
      subtitle="Continue de onde parou. Foco, organização e evolução."
      footer={<>Ainda não tem conta? <Link to="/auth/cadastro" className="font-medium text-primary hover:underline">Criar conta</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Senha</Label>
            <Link to="/auth/recuperar" className="text-xs font-medium text-primary hover:underline">Esqueci minha senha</Link>
          </div>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
        </Button>
      </form>
    </AuthShell>
  );
}