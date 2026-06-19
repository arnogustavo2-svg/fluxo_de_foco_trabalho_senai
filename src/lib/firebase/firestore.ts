import type {
  Curso, Material, Tarefa, Meta, SessaoPomodoro,
  Revisao, Notificacao, RecomendacaoEstudo,
} from "@/types";
import { mockData } from "@/lib/mock/data";

type Collections = {
  cursos: Curso;
  materiais: Material;
  tarefas: Tarefa;
  metas: Meta;
  sessoes_pomodoro: SessaoPomodoro;
  revisoes: Revisao;
  notificacoes: Notificacao;
  recomendacoes: RecomendacaoEstudo;
};
type CollectionName = keyof Collections;

function storageKey(name: CollectionName) {
  return `focused.db.v2.${name}`;
}

function load<T>(name: CollectionName, seed: T[]): T[] {
  if (typeof window === "undefined") return seed;
  const raw = window.localStorage.getItem(storageKey(name));
  if (!raw) {
    window.localStorage.setItem(storageKey(name), JSON.stringify(seed));
    return seed;
  }
  try { return JSON.parse(raw) as T[]; } catch { return seed; }
}

function save<T>(name: CollectionName, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(name), JSON.stringify(items));
}

export async function list<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  return load(name, mockData[name] as Collections[K][]);
}

export async function get<K extends CollectionName>(name: K, id: string): Promise<Collections[K] | null> {
  const items = await list(name);
  return items.find((i) => (i as { id: string }).id === id) ?? null;
}

export async function create<K extends CollectionName>(name: K, doc: Collections[K]): Promise<Collections[K]> {
  const items = await list(name);
  save(name, [...items, doc]);
  return doc;
}

export async function update<K extends CollectionName>(name: K, id: string, patch: Partial<Collections[K]>): Promise<Collections[K] | null> {
  const items = await list(name);
  const idx = items.findIndex((i) => (i as { id: string }).id === id);
  if (idx < 0) return null;
  const merged = { ...items[idx], ...patch } as Collections[K];
  const next = [...items];
  next[idx] = merged;
  save(name, next);
  return merged;
}

export async function remove<K extends CollectionName>(name: K, id: string): Promise<void> {
  const items = await list(name);
  save(name, items.filter((i) => (i as { id: string }).id !== id));
}