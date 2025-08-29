"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Dead = { id: string; title: string; dueAt: string; caseId: string };
type Hear = { id: string; date: string; type?: string; caseId: string };

export default function CalendarPage() {
  const [deadlines, setDeadlines] = useState<Dead[]>([]);
  const [hearings, setHearings] = useState<Hear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [d, h] = await Promise.all([
          apiFetch("/deadlines/upcoming?days=30"),
          apiFetch("/hearings/upcoming?days=30"),
        ]);
        setDeadlines(d);
        setHearings(h);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const entries = useMemo(() => {
    const d = deadlines.map((x) => ({
      id: x.id,
      when: new Date(x.dueAt).getTime(),
      label: `Plazo: ${x.title}`,
      caseId: x.caseId,
    }));
    const h = hearings.map((x) => ({
      id: x.id,
      when: new Date(x.date).getTime(),
      label: `Audiencia: ${x.type || ''}`,
      caseId: x.caseId,
    }));
    return [...d, ...h].sort((a, b) => a.when - b.when);
  }, [deadlines, hearings]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-brand">Calendario</div>
          <Link href="/" className="text-muted hover:text-foreground">Inicio</Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-3">
            {entries.map((e) => (
              <div key={`${e.id}`} className="rounded-md border border-muted/20 p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">{e.label}</div>
                  <div className="text-xs text-muted">{new Date(e.when).toLocaleString()}</div>
                </div>
                <Link className="text-brand text-sm hover:underline" href={`/cases/${e.caseId}/hearings`}>Abrir caso</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


