import type { User } from "@/types";

const KEY = "focused.session.user.v2";

function read(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  if (!raw) return null;
  const u = JSON.parse(raw) as User;
  // Garante que o nome de exibição seja sempre "Matheus"
  if (u.nome !== "Matheus") {
    u.nome = "Matheus";
    window.localStorage.setItem(KEY, JSON.stringify(u));
  }
  return u;
}

function write(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(KEY, JSON.stringify(user));
  else window.localStorage.removeItem(KEY);
}

function nomeFromEmail(email: string): string {
  return "Matheus";
}

export async function signInWithEmail(email: string, _password: string): Promise<User> {
  const existing = read();
  const user: User =
    existing && existing.email === email
      ? { ...existing, nome: "Matheus" }
      : {
          id: crypto.randomUUID(),
          nome: nomeFromEmail(email),
          email,
          role: "aluno",
          data_criacao: new Date().toISOString(),
          consentimento_lgpd: true,
        };
  write(user);
  return user;
}

export async function signUpWithEmail(nome: string, email: string, _password: string): Promise<User> {
  const user: User = {
    id: crypto.randomUUID(),
    nome,
    email,
    role: "aluno",
    data_criacao: new Date().toISOString(),
    consentimento_lgpd: true,
  };
  write(user);
  return user;
}

export async function sendPasswordReset(_email: string): Promise<void> {
  await new Promise((r) => setTimeout(r, 600));
}

export async function signOut(): Promise<void> {
  write(null);
}

export function getCurrentUser(): User | null {
  return read();
}

export function updateCurrentUser(patch: Partial<User>): User | null {
  const u = read();
  if (!u) return null;
  const next = { ...u, ...patch };
  write(next);
  return next;
}
