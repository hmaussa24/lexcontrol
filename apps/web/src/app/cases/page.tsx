"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";

type Case = { id: string; expedienteNumber: string; title: string; status: string };
type CasesResponse = { total: number; page: number; pageSize: number; data: Case[] };

export default function CasesPage() {
  const [items, setItems] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [clientId, setClientId] = useState("");
  const [processType, setProcessType] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState<'updatedAt'|'expedienteNumber'|'title'>('updatedAt');
  const [dir, setDir] = useState<'asc'|'desc'>('desc');
  const [form, setForm] = useState({ expedienteNumber: "", title: "", processType: "CIVIL", clientId: "" });
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Case>>({ title: "" });

  async function load() {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (q) qs.set('q', q);
      if (status) qs.set('status', status);
      if (clientId) qs.set('clientId', clientId);
      if (processType) qs.set('processType', processType);
      qs.set('page', String(page));
      qs.set('pageSize', String(pageSize));
      qs.set('sort', sort);
      qs.set('dir', dir);
      const res: CasesResponse = await apiFetch(`/cases${qs.toString() ? `?${qs.toString()}` : ''}`);
      setItems(Array.isArray((res as any).data) ? (res as any).data : Array.isArray((res as any)) ? (res as any) : []);
      setTotal(res.total);
      const cl = await apiFetch("/clients");
      setClients(Array.isArray((cl as any)?.data) ? (cl as any).data : Array.isArray(cl) ? cl : []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [q, status, clientId, processType, page, pageSize, sort, dir]);

  function exportCsv() {
    const header = ['Expediente','Título','Estado'];
    const rows = items.map((c) => [c.expedienteNumber, c.title, c.status]);
    const csv = [header, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'casos.csv'; a.click(); URL.revokeObjectURL(url);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!form.clientId) throw new Error("Ingresa clientId (temporal)");
      await apiFetch("/cases", { method: "POST", body: JSON.stringify(form) });
      setForm({ expedienteNumber: "", title: "", processType: "CIVIL", clientId: "" });
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onStartEdit(c: Case) {
    setEditing(c.id);
    setEditForm({ title: c.title });
  }

  async function onSaveEdit(id: string) {
    try {
      await apiFetch(`/cases/${id}`, { method: "PUT", body: JSON.stringify({ title: editForm.title }) });
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function onDelete(id: string) {
    if (!confirm("¿Eliminar caso?")) return;
    try {
      await apiFetch(`/cases/${id}`, { method: "DELETE" });
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
        <div className="mb-6 grid md:grid-cols-8 gap-3">
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-2" placeholder="Buscar (expediente o título)" value={q} onChange={e=>setQ(e.target.value)} />
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="ACTIVO">Activo</option>
            <option value="APELACION">Apelación</option>
            <option value="ARCHIVADO">Archivado</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={clientId} onChange={e=>{ setClientId(e.target.value); setPage(1); }}>
            <option value="">Todos los clientes</option>
            {clients.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={processType} onChange={e=>{ setProcessType(e.target.value); setPage(1); }}>
            <option value="">Todos los tipos</option>
            <option value="CIVIL">Civil</option>
            <option value="PENAL">Penal</option>
            <option value="LABORAL">Laboral</option>
            <option value="ADMINISTRATIVO">Administrativo</option>
            <option value="OTRO">Otro</option>
          </select>
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={sort} onChange={e=>{ setSort(e.target.value as any); setPage(1); }}>
            <option value="updatedAt">Ordenar: Actualización</option>
            <option value="expedienteNumber">Ordenar: Expediente</option>
            <option value="title">Ordenar: Título</option>
          </select>
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={dir} onChange={e=>{ setDir(e.target.value as any); setPage(1); }}>
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border h-12 px-4 text-base" onClick={()=>{ setQ(""); setStatus(""); setClientId(""); setProcessType(""); setSort('updatedAt'); setDir('desc'); setPage(1); }}>Limpiar</button>
            <button className="rounded-lg border h-12 px-4 text-base" onClick={exportCsv}>Exportar CSV</button>
          </div>
        </div>
        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-4 gap-4">
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Expediente" value={form.expedienteNumber} onChange={e=>setForm({...form, expedienteNumber:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.processType} onChange={e=>setForm({...form, processType:e.target.value})}>
            <option value="CIVIL">Civil</option>
            <option value="PENAL">Penal</option>
            <option value="LABORAL">Laboral</option>
            <option value="ADMINISTRATIVO">Administrativo</option>
            <option value="OTRO">Otro</option>
          </select>
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.clientId} onChange={e=>setForm({...form, clientId:e.target.value})} required>
            <option value="">Selecciona cliente</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="md:col-span-4 rounded-lg bg-brand text-white h-12 px-4 text-base hover:opacity-90">Crear caso</button>
          {error && <p className="md:col-span-4 text-sm text-red-600">{error}</p>}
        </form>

        <div className="mt-8 grid gap-4">
          {loading ? (
            <div className="text-muted">Cargando…</div>
          ) : (
            <>
              {items.map((c) => (
                <div key={c.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                  {editing === c.id ? (
                    <div className="flex-1 grid md:grid-cols-2 gap-2">
                      <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.title || ""} onChange={e=>setEditForm({...editForm, title:e.target.value})} />
                      <div className="text-sm text-muted">Expediente: {c.expedienteNumber}</div>
                    </div>
                  ) : (
                    <div className="flex-1">
                      <div className="font-semibold">{c.title}</div>
                      <div className="text-sm text-muted">Expediente: {c.expedienteNumber}</div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Link className="text-brand hover:underline" href={`/cases/${c.id}`}>Abrir</Link>
                    <Link className="text-brand hover:underline" href={`/cases/${c.id}/documents`}>Documentos</Link>
                    {editing === c.id ? (
                      <>
                        <button type="button" onClick={()=>onSaveEdit(c.id)} className="rounded-md bg-brand text-white h-10 px-3">Guardar</button>
                        <button type="button" onClick={()=>setEditing(null)} className="rounded-md border h-10 px-3">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button type="button" onClick={()=>onStartEdit(c)} className="rounded-md border h-10 px-3">Editar</button>
                        <button type="button" onClick={()=>onDelete(c.id)} className="rounded-md border h-10 px-3">Eliminar</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between mt-2 text-sm">
                <div>Mostrando {items.length} de {total}</div>
                <div className="flex items-center gap-2">
                  <button className="rounded-md border h-9 px-3" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button>
                  <div>Página {page}</div>
                  <button className="rounded-md border h-9 px-3" disabled={page*pageSize>=total} onClick={()=>setPage(p=>p+1)}>Siguiente</button>
                  <select className="rounded-md border h-9 px-2" value={pageSize} onChange={e=>{ setPage(1); setPageSize(parseInt(e.target.value)); }}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


