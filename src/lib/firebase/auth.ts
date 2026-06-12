import type { User } from "@/types";
import { seedUser } from "@/lib/mock/data";

const KEY = "focused.session.user";

function read(): User | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

function write(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(KEY, JSON.stringify(user));
  else window.localStorage.removeItem(KEY);
}

export async function signInWithEmail(email: string, _password: string): Promise<User> {
  const user: User = { ...seedUser, email };
  write(user);
  return user;
}

export async function signUpWithEmail(nome: string, email: string, _password: string): Promise<User> {
  const user: User = { ...seedUser, nome, email, id: crypto.randomUUID() };
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