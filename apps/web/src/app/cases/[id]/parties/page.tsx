"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type Party = { id: string; type: string; name: string; identification?: string };

export default function CasePartiesPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<Party[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ type: "demandante", name: "", identification: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ type: string; name: string; identification?: string }>({ type: "demandante", name: "", identification: "" });

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/case-parties/case/${caseId}`);
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
      await apiFetch(`/case-parties`, { method: "POST", body: JSON.stringify({ caseId, ...form }) });
      setForm({ type: "demandante", name: "", identification: "" });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  function startEdit(p: Party) {
    setEditing(p.id);
    setEditForm({ type: p.type, name: p.name, identification: p.identification });
  }

  async function saveEdit(id: string) {
    try {
      await apiFetch(`/case-parties/${id}`, { method: "PUT", body: JSON.stringify(editForm) });
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar parte?")) return;
    try {
      await apiFetch(`/case-parties/${id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Partes del caso</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-4 gap-4 mb-8">
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option value="demandante">Demandante</option>
            <option value="demandado">Demandado</option>
            <option value="tercero">Tercero</option>
          </select>
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Identificación" value={form.identification} onChange={e=>setForm({...form, identification:e.target.value})} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base hover:opacity-90">Agregar parte</button>
          {error && <p className="md:col-span-4 text-sm text-red-600">{error}</p>}
        </form>

        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-3">
            {items.map((p) => (
              <div key={p.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === p.id ? (
                  <div className="flex-1 grid md:grid-cols-3 gap-2">
                    <select className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.type} onChange={e=>setEditForm({...editForm, type:e.target.value})}>
                      <option value="demandante">Demandante</option>
                      <option value="demandado">Demandado</option>
                      <option value="tercero">Tercero</option>
                    </select>
                    <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.identification || ""} onChange={e=>setEditForm({...editForm, identification:e.target.value})} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-muted">{p.type} {p.identification ? `· ${p.identification}` : ""}</div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {editing === p.id ? (
                    <>
                      <button className="rounded-md bg-brand text-white h-9 px-3" onClick={()=>saveEdit(p.id)} type="button">Guardar</button>
                      <button className="rounded-md border h-9 px-3" onClick={()=>setEditing(null)} type="button">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-md border h-9 px-3" onClick={()=>startEdit(p)} type="button">Editar</button>
                      <button className="rounded-md border h-9 px-3" onClick={()=>onDelete(p.id)} type="button">Eliminar</button>
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


