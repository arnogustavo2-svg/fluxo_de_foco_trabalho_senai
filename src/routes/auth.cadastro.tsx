import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/cadastro")({
  head: () => ({ meta: [{ title: "Criar conta — FocusEd" }] }),
  component: CadastroPage,
});

function CadastroPage() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmar: "" });
  const [aceite, setAceite] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome.trim()) return toast.error("Informe seu nome");
    if (form.senha.length < 6) return toast.error("A senha precisa de 6+ caracteres");
    if (form.senha !== form.confirmar) return toast.error("As senhas não coincidem");
    if (!aceite) return toast.error("Você precisa aceitar os termos e a LGPD");
    setLoading(true);
    try {
      await signUp(form.nome, form.email, form.senha);
      toast.success("Conta criada! Vamos começar.");
      router.navigate({ to: "/app" });
    } finally { setLoading(false); }
  }

  return (
    <AuthShell
      title="Criar sua conta"
      subtitle="Leva menos de um minuto. Sem cartão de crédito."
      footer={<>Já tem conta? <Link to="/auth/login" className="font-medium text-primary hover:underline">Entrar</Link></>}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome completo</Label>
          <Input id="nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input id="senha" type="password" value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmar">Confirmar</Label>
            <Input id="confirmar" type="password" value={form.confirmar} onChange={(e) => setForm({ ...form, confirmar: e.target.value })} required />
          </div>
        </div>
        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(Boolean(v))} className="mt-0.5" />
          <span>Li e aceito os <a className="text-primary hover:underline" href="#">termos de uso</a> e o tratamento de dados conforme a LGPD.</span>
        </label>
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? "Criando…" : "Criar conta"}
        </Button>
      </form>
    </AuthShell>
  );
}