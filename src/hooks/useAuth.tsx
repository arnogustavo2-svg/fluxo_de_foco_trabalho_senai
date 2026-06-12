import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types";
import * as authApi from "@/lib/firebase/auth";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (nome: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (patch: Partial<User>) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(authApi.getCurrentUser());
    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setUser(await authApi.signInWithEmail(email, password));
  }, []);
  const signUp = useCallback(async (nome: string, email: string, password: string) => {
    setUser(await authApi.signUpWithEmail(nome, email, password));
  }, []);
  const signOut = useCallback(async () => {
    await authApi.signOut();
    setUser(null);
  }, []);
  const resetPassword = useCallback(async (email: string) => {
    await authApi.sendPasswordReset(email);
  }, []);
  const updateProfile = useCallback((patch: Partial<User>) => {
    const next = authApi.updateCurrentUser(patch);
    if (next) setUser(next);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updateProfile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth precisa estar dentro de <AuthProvider>");
  return ctx;
}