import { useEffect, useState } from "react";
import * as db from "@/lib/firebase/firestore";

export function useCollection<K extends Parameters<typeof db.list>[0]>(name: K) {
  const [data, setData] = useState<Awaited<ReturnType<typeof db.list<K>>>>([] as never);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    const items = await db.list(name);
    setData(items as never);
    setLoading(false);
  };

  useEffect(() => { void reload(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [name]);

  return { data, loading, reload };
}