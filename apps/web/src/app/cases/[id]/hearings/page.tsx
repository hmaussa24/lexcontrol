"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Hearing = { id: string; date: string; time?: string; location?: string; type?: string };

export default function CaseHearingsPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ date: '', time: '', location: '', type: '' });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Hearing>>({});

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/hearings/case/${caseId}`);
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (caseId) load(); }, [caseId]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch(`/hearings`, { method: 'POST', body: JSON.stringify({ caseId, ...form, date: form.date }) });
      setForm({ date: '', time: '', location: '', type: '' });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(h: Hearing) {
    setEditing(h.id);
    setEditForm({ date: h.date.slice(0,16), time: h.time, location: h.location, type: h.type });
  }

  async function saveEdit(id: string) {
    try {
      await apiFetch(`/hearings/${id}`, { method: 'PUT', body: JSON.stringify({ ...editForm, date: editForm.date }) });
      setEditing(null);
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function onDelete(id: string) {
    if (!confirm('¿Eliminar audiencia?')) return;
    try { await apiFetch(`/hearings/${id}`, { method: 'DELETE' }); await load(); } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-5 gap-4">
          <input type="datetime-local" className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-2" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Tipo" value={form.type} onChange={e=>setForm({...form, type:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Lugar" value={form.location} onChange={e=>setForm({...form, location:e.target.value})} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base hover:opacity-90">Crear</button>
          {error && <p className="md:col-span-5 text-sm text-red-600">{error}</p>}
        </form>
        <div className="mt-8 grid gap-4">
          {loading ? (
            <div className="text-muted">Cargando…</div>
          ) : (
            items.map((h) => (
              <div key={h.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === h.id ? (
                  <div className="flex-1 grid md:grid-cols-4 gap-2">
                    <input type="datetime-local" className="rounded-lg border border-muted/40 h-10 px-3 md:col-span-2" value={(editForm.date as string) || ''} onChange={e=>setEditForm({...editForm, date: e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Tipo" value={editForm.type || ''} onChange={e=>setEditForm({...editForm, type: e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Lugar" value={editForm.location || ''} onChange={e=>setEditForm({...editForm, location: e.target.value})} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{h.type || 'Audiencia'}</div>
                    <div className="text-sm text-muted">{new Date(h.date).toLocaleString()} {h.time ? `· ${h.time}` : ''}</div>
                    {h.location && <div className="text-sm text-muted">{h.location}</div>}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {editing === h.id ? (
                    <>
                      <button className="rounded-md bg-brand text-white h-9 px-3" type="button" onClick={()=>saveEdit(h.id)}>Guardar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>setEditing(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>startEdit(h)}>Editar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>onDelete(h.id)}>Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}


