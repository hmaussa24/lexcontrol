"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type Assignment = { id: string; userId: string; role: string; since?: string; until?: string };

export default function CaseTeamPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ userId: "", role: "responsable", since: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Assignment>>({ role: "responsable" });

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/case-assignments/case/${caseId}`);
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
      await apiFetch(`/case-assignments`, { method: "POST", body: JSON.stringify({ caseId, ...form }) });
      setForm({ userId: "", role: "responsable", since: "" });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(a: Assignment) { setEditing(a.id); setEditForm({ role: a.role, since: a.since, until: a.until }); }
  async function saveEdit(id: string) {
    try {
      await apiFetch(`/case-assignments/${id}`, { method: "PUT", body: JSON.stringify(editForm) });
      setEditing(null);
      await load();
    } catch (e: any) { setError(e.message); }
  }
  async function onDelete(id: string) {
    if (!confirm("¿Eliminar asignación?")) return;
    try { await apiFetch(`/case-assignments/${id}`, { method: "DELETE" }); await load(); } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Equipo del caso</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-4 gap-4 mb-8">
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="userId (temporal)" value={form.userId} onChange={e=>setForm({...form, userId:e.target.value})} required />
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
            <option value="responsable">Responsable</option>
            <option value="coautor">Co‑autor</option>
            <option value="paralegal">Paralegal</option>
          </select>
          <input type="date" className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.since} onChange={e=>setForm({...form, since:e.target.value})} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base hover:opacity-90">Agregar</button>
          {error && <p className="md:col-span-4 text-sm text-red-600">{error}</p>}
        </form>

        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-3">
            {items.map((a) => (
              <div key={a.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === a.id ? (
                  <div className="flex-1 grid md:grid-cols-3 gap-2">
                    <select className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.role || "responsable"} onChange={e=>setEditForm({...editForm, role:e.target.value})}>
                      <option value="responsable">Responsable</option>
                      <option value="coautor">Co‑autor</option>
                      <option value="paralegal">Paralegal</option>
                    </select>
                    <input type="date" className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.since || ""} onChange={e=>setEditForm({...editForm, since:e.target.value})} />
                    <input type="date" className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.until || ""} onChange={e=>setEditForm({...editForm, until:e.target.value})} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{a.role}</div>
                    <div className="text-sm text-muted">userId: {a.userId}</div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {editing === a.id ? (
                    <>
                      <button className="rounded-md bg-brand text-white h-9 px-3" onClick={()=>saveEdit(a.id)} type="button">Guardar</button>
                      <button className="rounded-md border h-9 px-3" onClick={()=>setEditing(null)} type="button">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-md border h-9 px-3" onClick={()=>startEdit(a)} type="button">Editar</button>
                      <button className="rounded-md border h-9 px-3" onClick={()=>onDelete(a.id)} type="button">Eliminar</button>
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


