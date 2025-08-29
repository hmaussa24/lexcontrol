"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type ActionItem = { id: string; date: string; type: string; summary: string };
type NoteItem = { id: string; createdAt: string; content: string };

export default function CaseTimelinePage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [actionForm, setActionForm] = useState({ date: "", type: "Actuación", summary: "" });
  const [noteForm, setNoteForm] = useState({ content: "" });

  async function load() {
    try {
      setLoading(true);
      const [a, n] = await Promise.all([
        apiFetch(`/case-actions/case/${caseId}`),
        apiFetch(`/case-notes/case/${caseId}`),
      ]);
      setActions(a);
      setNotes(n);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (caseId) load(); }, [caseId]);

  async function createAction(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch(`/case-actions`, { method: 'POST', body: JSON.stringify({ caseId, ...actionForm, date: actionForm.date }) });
      setActionForm({ date: "", type: "Actuación", summary: "" });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch(`/case-notes`, { method: 'POST', body: JSON.stringify({ caseId, ...noteForm }) });
      setNoteForm({ content: "" });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Timeline</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={createAction} className="rounded-xl border border-muted/20 bg-surface p-6 grid gap-3">
            <div className="font-semibold">Nueva actuación</div>
            <input type="datetime-local" className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={actionForm.date} onChange={e=>setActionForm({...actionForm, date:e.target.value})} required />
            <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Tipo" value={actionForm.type} onChange={e=>setActionForm({...actionForm, type:e.target.value})} />
            <textarea className="rounded-lg border border-muted/40 px-4 py-3 text-base min-h-[96px]" placeholder="Resumen" value={actionForm.summary} onChange={e=>setActionForm({...actionForm, summary:e.target.value})} />
            <button className="rounded-lg bg-brand text-white h-12 px-4 text-base">Agregar</button>
          </form>

          <form onSubmit={createNote} className="rounded-xl border border-muted/20 bg-surface p-6 grid gap-3">
            <div className="font-semibold">Nueva nota</div>
            <textarea className="rounded-lg border border-muted/40 px-4 py-3 text-base min-h-[120px]" placeholder="Contenido" value={noteForm.content} onChange={e=>setNoteForm({content:e.target.value})} />
            <button className="rounded-lg bg-brand text-white h-12 px-4 text-base">Agregar</button>
          </form>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-muted/20 bg-surface p-6">
            <div className="font-semibold mb-3">Actuaciones</div>
            {loading ? (<div className="text-muted">Cargando…</div>) : (
              <div className="grid gap-3">
                {actions.map(a => (
                  <div key={a.id} className="rounded-lg border border-muted/20 p-4">
                    <div className="text-sm text-muted">{new Date(a.date).toLocaleString()} · {a.type}</div>
                    <div className="mt-1">{a.summary}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="rounded-xl border border-muted/20 bg-surface p-6">
            <div className="font-semibold mb-3">Notas</div>
            {loading ? (<div className="text-muted">Cargando…</div>) : (
              <div className="grid gap-3">
                {notes.map(n => (
                  <div key={n.id} className="rounded-lg border border-muted/20 p-4">
                    <div className="text-sm text-muted">{new Date(n.createdAt).toLocaleString()}</div>
                    <div className="mt-1 whitespace-pre-line">{n.content}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


