import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Download, KeyRound, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";

export const Route = createFileRoute("/app/perfil")({
  head: () => ({ meta: [{ title: "Perfil — FocusEd" }] }),
  component: PerfilPage,
});

function PerfilPage() {
  const { user, updateProfile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [nome, setNome] = useState(user?.nome ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  function salvar() {
    updateProfile({ nome, email });
    toast.success("Perfil atualizado");
  }

  function exportar() {
    const blob = new Blob([JSON.stringify({ user }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "focused-meus-dados.json"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Seus dados foram exportados");
  }

  const initials = (user?.nome || "U").split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div>
      <PageHeader title="Perfil" description="Gerencie sua conta, preferências e dados." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="font-display">Informações da conta</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">{initials}</div>
              <div>
                <p className="font-medium">{user?.nome}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="nome">Nome</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            </div>
            <div className="flex gap-2">
              <Button onClick={salvar}>Salvar alterações</Button>
              <Button variant="outline"><KeyRound className="mr-2 h-4 w-4" /> Alterar senha</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="font-display">Preferências</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Modo escuro</p>
                <p className="text-xs text-muted-foreground">Reduz fadiga visual à noite</p>
              </div>
              <Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="font-display">Dados e privacidade</CardTitle></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={exportar} className="justify-start"><Download className="mr-2 h-4 w-4" /> Exportar meus dados</Button>
            <Button
              variant="outline"
              className="justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={async () => {
                if (!confirm("Tem certeza? Esta ação é irreversível.")) return;
                await signOut();
                router.navigate({ to: "/auth/login" });
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Excluir minha conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}