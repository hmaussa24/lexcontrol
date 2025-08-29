"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";

type Client = { id: string; name: string; type: string; identification?: string; email?: string; phones?: string[]; city?: string; state?: string; country?: string; tags?: string[] };

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", type: "persona", identification: "", email: "", phones: "", city: "", state: "", country: "", tags: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; type: string; identification?: string; email?: string; phones?: string; city?: string; state?: string; country?: string; tags?: string }>({ name: "", type: "persona", identification: "", email: "", phones: "", city: "", state: "", country: "", tags: "" });
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  async function load() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (typeFilter) params.set('type', typeFilter);
      if (statusFilter) params.set('status', statusFilter);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      const res = await apiFetch(`/clients?${params.toString()}`);
      setItems(Array.isArray(res.data) ? res.data : res);
      if (res.total != null) setTotal(res.total);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [q, typeFilter, statusFilter, page, pageSize]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await apiFetch("/clients", { method: "POST", body: JSON.stringify({
        name: form.name,
        type: form.type,
        identification: form.identification || undefined,
        email: form.email || undefined,
        phones: form.phones ? form.phones.split(',').map(s=>s.trim()).filter(Boolean) : [],
        city: form.city || undefined,
        state: form.state || undefined,
        country: form.country || undefined,
        tags: form.tags ? form.tags.split(',').map(s=>s.trim()).filter(Boolean) : [],
      }) });
      setForm({ name: "", type: "persona", identification: "", email: "", phones: "", city: "", state: "", country: "", tags: "" });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onStartEdit(c: Client) {
    setEditing(c.id);
    setEditForm({ name: c.name, type: c.type, identification: c.identification, email: c.email || "", phones: (c.phones||[]).join(', '), city: c.city || "", state: c.state || "", country: c.country || "", tags: (c.tags||[]).join(', ') });
  }

  async function onSaveEdit(id: string) {
    try {
      await apiFetch(`/clients/${id}`, { method: "PUT", body: JSON.stringify({
        name: editForm.name,
        type: editForm.type,
        identification: editForm.identification || undefined,
        email: editForm.email || undefined,
        phones: editForm.phones ? editForm.phones.split(',').map(s=>s.trim()).filter(Boolean) : [],
        city: editForm.city || undefined,
        state: editForm.state || undefined,
        country: editForm.country || undefined,
        tags: editForm.tags ? editForm.tags.split(',').map(s=>s.trim()).filter(Boolean) : [],
      }) });
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar cliente?")) return;
    try {
      await apiFetch(`/clients/${id}`, { method: "DELETE" });
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
        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-4 gap-4">
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.type} onChange={e=>setForm({...form, type:e.target.value})}>
            <option value="persona">Persona</option>
            <option value="empresa">Empresa</option>
          </select>
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Identificación" value={form.identification} onChange={e=>setForm({...form, identification:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Teléfonos (coma)" value={form.phones} onChange={e=>setForm({...form, phones:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Ciudad" value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Departamento/Estado" value={form.state} onChange={e=>setForm({...form, state:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="País" value={form.country} onChange={e=>setForm({...form, country:e.target.value})} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-2" placeholder="Tags (coma)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base hover:opacity-90">Crear cliente</button>
          {error && <p className="md:col-span-4 text-sm text-red-600">{error}</p>}
        </form>

        <div className="mt-6 flex items-center gap-3">
          <input className="rounded-md border border-muted/40 h-10 px-3 flex-1" placeholder="Buscar (nombre, ID, email, teléfono)" value={q} onChange={e=>{setQ(e.target.value); setPage(1);}} />
          <select className="rounded-md border border-muted/40 h-10 px-3" value={typeFilter} onChange={e=>{setTypeFilter(e.target.value); setPage(1);}}>
            <option value="">Tipo</option>
            <option value="persona">Persona</option>
            <option value="empresa">Empresa</option>
          </select>
          <select className="rounded-md border border-muted/40 h-10 px-3" value={statusFilter} onChange={e=>{setStatusFilter(e.target.value); setPage(1);}}>
            <option value="">Estado</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>

        <div className="mt-4 grid gap-4">
          {loading ? (
            <div className="text-muted">Cargando…</div>
          ) : (
            items.map((c) => (
              <div key={c.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === c.id ? (
                  <div className="flex-1 grid md:grid-cols-3 gap-2">
                    <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.name} onChange={e=>setEditForm({...editForm, name:e.target.value})} />
                    <select className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.type} onChange={e=>setEditForm({...editForm, type:e.target.value})}>
                      <option value="persona">Persona</option>
                      <option value="empresa">Empresa</option>
                    </select>
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Identificación" value={editForm.identification || ""} onChange={e=>setEditForm({...editForm, identification:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Email" value={editForm.email || ""} onChange={e=>setEditForm({...editForm, email:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Teléfonos (coma)" value={editForm.phones || ""} onChange={e=>setEditForm({...editForm, phones:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Ciudad" value={editForm.city || ""} onChange={e=>setEditForm({...editForm, city:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Estado" value={editForm.state || ""} onChange={e=>setEditForm({...editForm, state:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="País" value={editForm.country || ""} onChange={e=>setEditForm({...editForm, country:e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3 md:col-span-3" placeholder="Tags (coma)" value={editForm.tags || ""} onChange={e=>setEditForm({...editForm, tags:e.target.value})} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-muted">{c.type} {c.identification ? `· ${c.identification}` : ""} {c.email ? `· ${c.email}` : ""} {(c.phones && c.phones.length) ? `· ${c.phones.join(', ')}` : ""}</div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {editing === c.id ? (
                    <>
                      <button type="button" onClick={()=>onSaveEdit(c.id)} className="rounded-md bg-brand text-white h-10 px-3 text-sm hover:opacity-90">Guardar</button>
                      <button type="button" onClick={()=>setEditing(null)} className="rounded-md border h-10 px-3 text-sm">Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button type="button" onClick={()=>onStartEdit(c)} className="rounded-md border h-10 px-3 text-sm">Editar</button>
                      <button type="button" onClick={()=>onDelete(c.id)} className="rounded-md border h-10 px-3 text-sm">Eliminar</button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div>{total} resultados</div>
          <div className="flex items-center gap-2">
            <button className="rounded-md border h-9 px-3" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
            <div>Página {page}</div>
            <button className="rounded-md border h-9 px-3" disabled={(page*pageSize)>=total} onClick={()=>setPage(p=>p+1)}>Siguiente</button>
          </div>
        </div>
      </main>
    </div>
  );
}


