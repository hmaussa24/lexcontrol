"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Doc = { id: string; name: string; access?: 'private'|'cliente'|'equipo'; tags?: string[]; currentVersion?: { storageKey: string; version: number } };
type DocVersion = { id: string; version: number; createdAt: string; mime?: string; size?: number };

export default function CaseDocumentsPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<FileList | null>(null);
  const [name, setName] = useState("");
  const [query, setQuery] = useState("");
  const [accessFilter, setAccessFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editForm, setEditForm] = useState<{ name: string; access: 'private'|'cliente'|'equipo'; tagsText?: string } | null>(null);
  const [versionsByDoc, setVersionsByDoc] = useState<Record<string, DocVersion[]>>({});
  const [uploadingVersionFor, setUploadingVersionFor] = useState<string|null>(null);

  async function load() {
    try {
      setLoading(true);
      const qs = new URLSearchParams();
      if (query) qs.set('q', query);
      if (accessFilter) qs.set('access', accessFilter);
      if (tagFilter) qs.set('tag', tagFilter);
      const data = await apiFetch(`/documents/case/${caseId}${qs.toString() ? `?${qs.toString()}` : ''}`);
      setItems(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (caseId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseId]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!files || files.length === 0) throw new Error("Selecciona archivos");
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append('caseId', caseId);
        fd.append('name', name || f.name);
        fd.append('file', f);
        await apiFetch(`/documents/upload-multipart`, { method: 'POST', body: fd });
      }
      setFiles(null);
      setName("");
      await load();
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function toggleVersions(docId: string) {
    if (versionsByDoc[docId]) {
      const next = { ...versionsByDoc };
      delete next[docId];
      setVersionsByDoc(next);
      return;
    }
    try {
      const list = await apiFetch(`/documents/${docId}/versions`);
      setVersionsByDoc(prev => ({ ...prev, [docId]: list }));
    } catch (e: any) { setError(e.message); }
  }

  async function uploadNewVersion(docId: string, file: File | null) {
    if (!file) return;
    try {
      setUploadingVersionFor(docId);
      const fd = new FormData();
      fd.append('file', file);
      await apiFetch(`/documents/${docId}/upload-version`, { method: 'POST', body: fd });
      const list = await apiFetch(`/documents/${docId}/versions`);
      setVersionsByDoc(prev => ({ ...prev, [docId]: list }));
      await load();
    } catch (e: any) { setError(e.message); } finally { setUploadingVersionFor(null); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <form onSubmit={onUpload} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-7 gap-4"
          onDragOver={(e)=>{e.preventDefault();}}
          onDrop={(e)=>{ e.preventDefault(); setFiles(e.dataTransfer.files); }}>
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Nombre (opcional)" value={name} onChange={e=>setName(e.target.value)} />
          <input multiple className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-brand file:text-white file:cursor-pointer" type="file" onChange={e=>setFiles(e.target.files)} />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Buscar" value={query} onChange={e=>setQuery(e.target.value)} />
          <select className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={accessFilter} onChange={e=>setAccessFilter(e.target.value)}>
            <option value="">Todas</option>
            <option value="private">Interno</option>
            <option value="cliente">Cliente</option>
            <option value="equipo">Equipo</option>
          </select>
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Etiqueta" value={tagFilter} onChange={e=>setTagFilter(e.target.value)} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base hover:opacity-90">Subir</button>
          {error && <p className="md:col-span-7 text-sm text-red-600">{error}</p>}
        </form>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <button className="rounded-md border h-9 px-3" onClick={()=>load()}>Aplicar filtros</button>
          <button className="rounded-md border h-9 px-3" onClick={()=>{ setQuery(""); setAccessFilter(""); setTagFilter(""); load(); }}>Limpiar</button>
        </div>
        <div className="mt-8 grid gap-4">
          {loading ? (
            <div className="text-muted">Cargando…</div>
          ) : (
            items.map((d) => (
              <div key={d.id} className="rounded-lg border border-muted/20 bg-surface p-4">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    {editingId === d.id ? (
                      <div className="grid md:grid-cols-4 gap-2">
                        <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm?.name || ''} onChange={e=>setEditForm(prev=> ({ ...(prev as any), name: e.target.value }))} />
                        <select className="rounded-lg border border-muted/40 h-10 px-3" value={editForm?.access || 'private'} onChange={e=>setEditForm(prev=> ({ ...(prev as any), access: e.target.value as any }))}>
                          <option value="private">Interno</option>
                          <option value="cliente">Cliente</option>
                          <option value="equipo">Equipo</option>
                        </select>
                        <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="tags (coma separadas)" value={editForm?.tagsText || ''} onChange={e=>setEditForm(prev=> ({ ...(prev as any), tagsText: e.target.value }))} />
                        <div className="flex items-center gap-2">
                          <button className="rounded-md bg-brand text-white h-10 px-3" type="button" onClick={async()=>{ const tags = (editForm?.tagsText || '').split(',').map(t=>t.trim()).filter(Boolean); await apiFetch(`/documents/${d.id}`, { method: 'PUT', body: JSON.stringify({ name: editForm?.name, access: editForm?.access, tags }) }); setEditingId(null); load(); }}>Guardar</button>
                          <button className="rounded-md border h-10 px-3" type="button" onClick={()=>setEditingId(null)}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="font-semibold truncate">{d.name}</div>
                        <div className="text-sm text-muted">Versión actual: {d.currentVersion?.version ?? 1} {d?.access ? `· ${d.access}` : ''}</div>
                        {d.tags && d.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {d.tags.map((t)=> (
                              <span key={t} className="text-xs rounded-full border border-muted/40 px-2 py-0.5">{t}</span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm shrink-0">
                    <button className="rounded-md border h-9 px-3" onClick={async()=>{ const { url } = await apiFetch(`/documents/${d.id}/signed-url`); if (url) window.open(url, '_blank'); }} type="button">Ver/Descargar</button>
                    {editingId === d.id ? null : <button className="rounded-md border h-9 px-3" type="button" onClick={()=>{ setEditingId(d.id); setEditForm({ name: d.name, access: (d.access as any) || 'private' }); }}>Editar</button>}
                    <button className="rounded-md border h-9 px-3" type="button" onClick={()=>toggleVersions(d.id)}>{versionsByDoc[d.id] ? 'Ocultar versiones' : 'Ver versiones'}</button>
                  </div>
                </div>
                {versionsByDoc[d.id] && (
                  <div className="mt-3 border-t border-muted/20 pt-3">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-sm">Versiones</div>
                      <input type="file" className="text-xs" onChange={e=>uploadNewVersion(d.id, e.target.files?.[0] || null)} disabled={uploadingVersionFor === d.id} />
                    </div>
                    <div className="mt-2 grid gap-2">
                      {versionsByDoc[d.id].map((v)=> (
                        <div key={v.id} className="flex items-center justify-between text-sm">
                          <div>v{v.version} · {new Date(v.createdAt).toLocaleString()}</div>
                          <button className="rounded-md border h-8 px-3" type="button" onClick={async()=>{ const { url } = await apiFetch(`/documents/versions/${v.id}/signed-url`); if (url) window.open(url,'_blank'); }}>Descargar</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}


