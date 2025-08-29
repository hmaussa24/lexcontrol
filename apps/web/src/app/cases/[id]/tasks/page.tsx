"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type Task = { id: string; title: string; description?: string; status: "TODO"|"IN_PROGRESS"|"DONE"; priority?: number; dueAt?: string; assigneeId?: string; order?: number };

export default function CaseTasksPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueAt, setNewDueAt] = useState("");
  const [newFiles, setNewFiles] = useState<FileList | null>(null);
  const [editingId, setEditingId] = useState<string|null>(null);
  const [editForm, setEditForm] = useState<{ title: string; description?: string; dueAt?: string }>({ title: "" });
  const [attachmentsByTask, setAttachmentsByTask] = useState<Record<string, any[]>>({});

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/case-tasks/case/${caseId}`);
      setTasks(data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  useEffect(() => { if (caseId) load(); }, [caseId]);

  async function addTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setError(null);
    try {
      const created = await apiFetch(`/case-tasks`, { method: 'POST', body: JSON.stringify({ caseId, title: newTitle, description: newDescription, dueAt: newDueAt || undefined }) });
      setNewTitle(""); setNewDescription(""); setNewDueAt("");
      if (newFiles && newFiles.length > 0) {
        const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(',')[1] || '';
            resolve(base64);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(f);
        });
        for (const file of Array.from(newFiles)) {
          const base64 = await fileToBase64(file);
          await apiFetch(`/task-attachments/upload`, { method: 'POST', body: JSON.stringify({ taskId: created.id, name: file.name, fileBase64: base64, mime: file.type }) });
        }
        setNewFiles(null);
      }
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function moveTask(id: string, status: Task["status"]) {
    try { await apiFetch(`/case-tasks/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }); await load(); } catch (e: any) { setError(e.message); }
  }

  async function loadAttachments(taskId: string) {
    try {
      const list = await apiFetch(`/task-attachments/task/${taskId}`);
      setAttachmentsByTask(prev => ({ ...prev, [taskId]: list }));
    } catch (e: any) { /* noop */ }
  }

  function startEdit(t: Task) {
    setEditingId(t.id);
    setEditForm({ title: t.title, description: t.description, dueAt: t.dueAt ? new Date(t.dueAt).toISOString().slice(0,16) : "" });
  }

  async function saveEdit(id: string) {
    try {
      await apiFetch(`/case-tasks/${id}`, { method: 'PUT', body: JSON.stringify({ title: editForm.title, description: editForm.description, dueAt: editForm.dueAt || undefined }) });
      setEditingId(null);
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function deleteTask(id: string) {
    if (!confirm('¿Eliminar tarea?')) return;
    try { await apiFetch(`/case-tasks/${id}`, { method: 'DELETE' }); await load(); } catch (e: any) { setError(e.message); }
  }

  async function downloadAttachment(attId: string) {
    try {
      const { url } = await apiFetch(`/task-attachments/${attId}/signed-url`);
      if (url) window.open(url, '_blank');
    } catch (e: any) { setError(e.message); }
  }

  async function uploadAttachmentsForTask(taskId: string, files: FileList | null) {
    if (!files || files.length === 0) return;
    const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(f);
    });
    for (const file of Array.from(files)) {
      const base64 = await fileToBase64(file);
      await apiFetch(`/task-attachments/upload`, { method: 'POST', body: JSON.stringify({ taskId, name: file.name, fileBase64: base64, mime: file.type }) });
    }
    await loadAttachments(taskId);
  }

  const grouped = useMemo(() => ({
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter(t => t.status === 'DONE')
  }), [tasks]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Tareas</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        <form onSubmit={addTask} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-6 gap-4 mb-8">
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-3" placeholder="Título" value={newTitle} onChange={e=>setNewTitle(e.target.value)} />
          <input type="datetime-local" className="rounded-lg border border-muted/40 h-12 px-4 text-base md:col-span-2" value={newDueAt} onChange={e=>setNewDueAt(e.target.value)} />
          <input type="file" multiple className="rounded-lg border border-muted/40 h-12 px-4 text-base" onChange={e=>setNewFiles(e.target.files)} />
          <textarea className="rounded-lg border border-muted/40 px-4 py-3 text-base md:col-span-5 min-h-[80px]" placeholder="Descripción" value={newDescription} onChange={e=>setNewDescription(e.target.value)} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base">Agregar</button>
          {error && <p className="md:col-span-6 text-sm text-red-600">{error}</p>}
        </form>

        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {([['TODO','Por hacer'],['IN_PROGRESS','En curso'],['DONE','Hechas']] as const).map(([key,label]) => (
              <div key={key} className="rounded-xl border border-muted/20 bg-surface p-4"
                onDragOver={(e)=>e.preventDefault()}
                onDrop={async (e)=>{ const id = e.dataTransfer.getData('text/task-id'); if (id) await moveTask(id, key as Task['status']); }}>
                <div className="font-semibold mb-3">{label}</div>
                <div className="grid gap-3">
                  {grouped[key as keyof typeof grouped].map(t => (
                    <div key={t.id} className="rounded-lg border border-muted/20 p-4" draggable onDragStart={(e)=>e.dataTransfer.setData('text/task-id', t.id)}>
                      {editingId === t.id ? (
                        <div className="grid gap-2">
                          <input className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} />
                          <textarea className="rounded-lg border border-muted/40 px-3 py-2 min-h-[60px]" value={editForm.description || ''} onChange={e=>setEditForm({...editForm, description: e.target.value})} />
                          <input type="datetime-local" className="rounded-lg border border-muted/40 h-10 px-3" value={editForm.dueAt || ''} onChange={e=>setEditForm({...editForm, dueAt: e.target.value})} />
                          <div className="flex items-center gap-2 text-xs">
                            <button className="rounded-md bg-brand text-white h-8 px-3" type="button" onClick={()=>saveEdit(t.id)}>Guardar</button>
                            <button className="rounded-md border h-8 px-3" type="button" onClick={()=>setEditingId(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium">{t.title}</div>
                          {t.description && <div className="text-sm text-muted mt-1 whitespace-pre-line">{t.description}</div>}
                          {t.dueAt && <div className="text-xs text-muted mt-1">Vence: {new Date(t.dueAt).toLocaleString()}</div>}
                          <div className="mt-3 flex items-center gap-2 text-xs">
                            {key !== 'TODO' && <button className="rounded-md border h-7 px-2" onClick={()=>moveTask(t.id, key === 'IN_PROGRESS' ? 'TODO' : 'IN_PROGRESS')} type="button">←</button>}
                            {key !== 'DONE' && <button className="rounded-md border h-7 px-2" onClick={()=>moveTask(t.id, key === 'TODO' ? 'IN_PROGRESS' : 'DONE')} type="button">→</button>}
                            <button className="rounded-md border h-7 px-2" type="button" onClick={()=>startEdit(t)}>Editar</button>
                            <button className="rounded-md border h-7 px-2" type="button" onClick={()=>deleteTask(t.id)}>Eliminar</button>
                          </div>
                          <div className="mt-2">
                            <button className="text-xs text-brand hover:underline" type="button" onClick={()=>loadAttachments(t.id)}>Ver adjuntos</button>
                            {attachmentsByTask[t.id] && (
                              <div className="mt-2 grid gap-1">
                                {attachmentsByTask[t.id].map((a:any)=> (
                                  <div key={a.id} className="flex items-center justify-between text-xs">
                                    <span>{a.name}</span>
                                    <div className="flex items-center gap-2">
                                      <button className="rounded-md border h-7 px-2" type="button" onClick={()=>downloadAttachment(a.id)}>Descargar</button>
                                      <button className="rounded-md border h-7 px-2" type="button" onClick={async()=>{ await apiFetch(`/task-attachments/${a.id}`, { method: 'DELETE' }); await loadAttachments(t.id); }}>Eliminar</button>
                                    </div>
                                  </div>
                                ))}
                                <div className="pt-2">
                                  <input type="file" multiple className="text-xs" onChange={e=>uploadAttachmentsForTask(t.id, e.target.files)} />
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


