"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type Deadline = { id: string; title: string; dueAt: string; type?: string; priority?: number; remindDays?: number; completed?: boolean };

export default function CaseDeadlinesPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<Deadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", dueAt: "", type: "", priority: 2, remindDays: 3 });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Deadline>>({});

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/deadlines/case/${caseId}`);
      setItems(data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  useEffect(() => { if (caseId) load(); }, [caseId]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try {
      await apiFetch(`/deadlines`, { method: 'POST', body: JSON.stringify({ caseId, ...form }) });
      setForm({ title: "", dueAt: "", type: "", priority: 2, remindDays: 3 });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  function startEdit(d: Deadline) {
    setEditing(d.id);
    setEditForm({ title: d.title, dueAt: d.dueAt.slice(0,16), type: d.type, priority: d.priority, remindDays: d.remindDays, completed: d.completed });
  }

  async function saveEdit(id: string) {
    try {
      await apiFetch(`/deadlines/${id}`, { method: 'PUT', body: JSON.stringify({ ...editForm, dueAt: editForm.dueAt }) });
      setEditing(null); await load();
    } catch (e: any) { setError(e.message); }
  }

  async function markDone(id: string, completed: boolean) {
    try { await apiFetch(`/deadlines/${id}`, { method: 'PUT', body: JSON.stringify({ completed }) }); await load(); } catch (e: any) { setError(e.message); }
  }

  async function onDelete(id: string) { if (!confirm('¿Eliminar plazo?')) return; try { await apiFetch(`/deadlines/${id}`, { method: 'DELETE' }); await load(); } catch (e: any) { setError(e.message); } }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Plazos del caso</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-6 gap-4 mb-8">
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-2" placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input type="datetime-local" className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.dueAt} onChange={e=>setForm({...form, dueAt:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Tipo" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
          <input type="number" className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Prioridad (1-4)" value={form.priority} onChange={e=>setForm({...form, priority:parseInt(e.target.value||'0')})} />
          <input type="number" className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Recordar (días)" value={form.remindDays} onChange={e=>setForm({...form, remindDays:parseInt(e.target.value||'0')})} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base">Crear</button>
          {error && <p className="md:col-span-6 text-sm text-red-600">{error}</p>}
        </form>

        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-3">
            {items.map((d) => (
              <div key={d.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === d.id ? (
                  <div className="flex-1 grid md:grid-cols-5 gap-2">
                    <input className="rounded-lg border border-muted/40 h-10 px-3 md:col-span-2" value={editForm.title as string || ''} onChange={e=>setEditForm({...editForm, title:e.target.value})} />
                    <input type="datetime-local" className="rounded-lg border border-muted/40 h-10 px-3" value={(editForm.dueAt as string) || ''} onChange={e=>setEditForm({...editForm, dueAt:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.type || ''} onChange={e=>setEditForm({...editForm, type:e.target.value})} />
                    <input type="number" className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.priority || 0} onChange={e=>setEditForm({...editForm, priority: parseInt(e.target.value||'0')})} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{d.title}</div>
                    <div className="text-sm text-muted">{new Date(d.dueAt).toLocaleString()} {d.type ? `· ${d.type}` : ''}</div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {editing === d.id ? (
                    <>
                      <button className="rounded-md bg-brand text-white h-9 px-3" type="button" onClick={()=>saveEdit(d.id)}>Guardar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>setEditing(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>startEdit(d)}>Editar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>markDone(d.id, !d.completed)}>{d.completed ? 'Reabrir' : 'Completar'}</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>onDelete(d.id)}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


