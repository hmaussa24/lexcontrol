"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";

type Hearing = { id: string; caseId: string; date: string; time?: string; location?: string; type?: string };

export default function HearingsPage() {
  const [items, setItems] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch("/hearings/upcoming?days=30");
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

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
            {items.map((h) => (
              <div key={h.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{h.type || 'Audiencia'}</div>
                  <div className="text-sm text-muted">{new Date(h.date).toLocaleString()} {h.time ? `· ${h.time}` : ''}</div>
                  {h.location && <div className="text-sm text-muted">{h.location}</div>}
                </div>
                <Link className="text-brand text-sm hover:underline" href={`/cases/${h.caseId}/hearings`}>Ver caso</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


