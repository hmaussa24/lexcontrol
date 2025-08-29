"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";

type Deadline = {
  id: string;
  title: string;
  dueAt: string;
  caseId: string;
};

export default function DeadlinesPage() {
  const [items, setItems] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch("/deadlines/upcoming?days=30");
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-4">
            {items.map((d) => (
              <div key={d.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{d.title}</div>
                  <div className="text-sm text-muted">Vence: {new Date(d.dueAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-muted">Caso: {d.caseId.slice(0, 8)}…</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


