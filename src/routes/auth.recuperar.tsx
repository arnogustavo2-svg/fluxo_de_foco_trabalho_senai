import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/layout/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth/recuperar")({
  head: () => ({ meta: [{ title: "Recuperar senha — FocusEd" }] }),
  component: RecuperarPage,
});

function RecuperarPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return toast.error("Informe seu email");
    setLoading(true);
    try { await resetPassword(email); setSent(true); toast.success("Email enviado"); }
    finally { setLoading(false); }
  }

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Enviaremos um link para você criar uma nova senha."
      footer={<><Link to="/auth/login" className="font-medium text-primary hover:underline">Voltar para o login</Link></>}
    >
      {sent ? (
        <div className="rounded-lg border border-success/30 bg-success/10 p-4 text-sm text-foreground">
          Se existir uma conta para <strong>{email}</strong>, você receberá um email com instruções.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Enviando…" : "Enviar link de recuperação"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}