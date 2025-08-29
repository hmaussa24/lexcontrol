"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type TimeEntry = { id: string; date: string; minutes: number; description?: string; billable?: boolean; hourlyRate?: string };

export default function CaseTimePage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ date: "", minutes: 60, description: "", billable: true, hourlyRate: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<TimeEntry>>({});
  const [summary, setSummary] = useState<{ hoursTotal: number; hoursBillable: number } | null>(null);

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/time-entries/case/${caseId}`);
      setItems(data);
      const s = await apiFetch(`/time-entries/case/${caseId}/summary`);
      setSummary(s);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  useEffect(() => { if (caseId) load(); }, [caseId]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try {
      await apiFetch(`/time-entries`, { method: 'POST', body: JSON.stringify({ caseId, ...form, date: form.date }) });
      setForm({ date: "", minutes: 60, description: "", billable: true, hourlyRate: "" });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  function startEdit(t: TimeEntry) {
    setEditing(t.id);
    setEditForm({ date: t.date.slice(0,16), minutes: t.minutes, description: t.description, billable: t.billable, hourlyRate: t.hourlyRate } as any);
  }

  async function saveEdit(id: string) {
    try { await apiFetch(`/time-entries/${id}`, { method: 'PUT', body: JSON.stringify({ ...editForm, date: editForm.date }) }); setEditing(null); await load(); } catch (e: any) { setError(e.message); }
  }

  async function onDelete(id: string) { if (!confirm('¿Eliminar tiempo?')) return; try { await apiFetch(`/time-entries/${id}`, { method: 'DELETE' }); await load(); } catch (e: any) { setError(e.message); } }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Tiempo del caso</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-6 gap-4 mb-8">
          <input type="datetime-local" className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
          <input type="number" className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Minutos" value={form.minutes} onChange={e=>setForm({...form, minutes: parseInt(e.target.value||'0')})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Tarifa por hora (opcional)" value={form.hourlyRate} onChange={e=>setForm({...form, hourlyRate: e.target.value})} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.billable} onChange={e=>setForm({...form, billable: e.target.checked})} /> Billable</label>
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base">Agregar</button>
          {error && <p className="md:col-span-6 text-sm text-red-600">{error}</p>}
        </form>

        {summary && (
          <div className="mb-6 grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-muted/20 bg-surface p-4">
              <div className="text-muted">Horas totales</div>
              <div className="mt-1 text-2xl font-bold">{summary.hoursTotal.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-4">
              <div className="text-muted">Horas billables</div>
              <div className="mt-1 text-2xl font-bold">{summary.hoursBillable.toFixed(2)}</div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-3">
            {items.map((t) => (
              <div key={t.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === t.id ? (
                  <div className="flex-1 grid md:grid-cols-5 gap-2">
                    <input type="datetime-local" className="rounded-lg border border-muted/40 h-10 px-3" value={(editForm.date as string) || ''} onChange={e=>setEditForm({...editForm, date: e.target.value})} />
                    <input type="number" className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.minutes || 0} onChange={e=>setEditForm({...editForm, minutes: parseInt(e.target.value||'0')})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Tarifa" value={editForm.hourlyRate || ''} onChange={e=>setEditForm({...editForm, hourlyRate: e.target.value})} />
                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editForm.billable} onChange={e=>setEditForm({...editForm, billable: e.target.checked})} /> Billable</label>
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{(t.minutes/60).toFixed(2)} h {t.billable ? '· billable' : ''}</div>
                    <div className="text-sm text-muted">{new Date(t.date).toLocaleString()} {t.description ? `· ${t.description}` : ''}</div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {editing === t.id ? (
                    <>
                      <button className="rounded-md bg-brand text-white h-9 px-3" type="button" onClick={()=>saveEdit(t.id)}>Guardar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>setEditing(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>startEdit(t)}>Editar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>onDelete(t.id)}>Eliminar</button>
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


