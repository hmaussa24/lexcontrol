"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

type Expense = { id: string; date: string; concept: string; amount: string; currency: string; notes?: string; receiptKey?: string };

export default function CaseExpensesPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [items, setItems] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ date: "", concept: "", amount: "", currency: "COP", notes: "", file: null as File | null });
  const [editing, setEditing] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  async function load() {
    try {
      setLoading(true);
      const data = await apiFetch(`/expenses/case/${caseId}`);
      setItems(data);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }

  useEffect(() => { if (caseId) load(); }, [caseId]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault(); setError(null);
    try {
      let receiptBase64: string | undefined; let receiptName: string | undefined; let receiptMime: string | undefined;
      if (form.file) {
        const base64 = await new Promise<string>((resolve,reject)=>{ const r = new FileReader(); r.onload=()=>resolve(((r.result as string).split(',')[1])||''); r.onerror=()=>reject(r.error); r.readAsDataURL(form.file as File); });
        receiptBase64 = base64; receiptName = form.file.name; receiptMime = form.file.type;
      }
      await apiFetch(`/expenses`, { method: 'POST', body: JSON.stringify({ caseId, date: form.date, concept: form.concept, amount: form.amount, currency: form.currency, notes: form.notes, receiptBase64, receiptName, receiptMime }) });
      setForm({ date: "", concept: "", amount: "", currency: "COP", notes: "", file: null });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  function startEdit(x: Expense) { setEditing(x.id); setEditForm({ date: x.date.slice(0,10), concept: x.concept, amount: x.amount, currency: x.currency, notes: x.notes }); }
  async function saveEdit(id: string) { try { await apiFetch(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(editForm) }); setEditing(null); await load(); } catch (e: any) { setError(e.message); } }
  async function onDelete(id: string) { if (!confirm('¿Eliminar gasto?')) return; try { await apiFetch(`/expenses/${id}`, { method: 'DELETE' }); await load(); } catch (e: any) { setError(e.message); } }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div className="font-bold text-xl">Gastos del caso</div>
          <Link href={`/cases/${caseId}`} className="text-muted hover:text-foreground text-sm">Volver al resumen</Link>
        </div>

        <form onSubmit={onCreate} className="rounded-xl border border-muted/20 bg-surface p-6 grid md:grid-cols-6 gap-4 mb-8">
          <input type="date" className="rounded-lg border border-muted/40 h-12 px-4 text-base" value={form.date} onChange={e=>setForm({...form, date:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Concepto" value={form.concept} onChange={e=>setForm({...form, concept:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Monto" value={form.amount} onChange={e=>setForm({...form, amount:e.target.value})} required />
          <input className="rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Moneda" value={form.currency} onChange={e=>setForm({...form, currency:e.target.value})} />
          <input type="file" className="rounded-lg border border-muted/40 h-12 px-4 text-base" onChange={e=>setForm({...form, file: e.target.files?.[0] || null})} />
          <input className="md:col-span-6 rounded-lg border border-muted/40 h-12 px-4 text-base" placeholder="Notas" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
          <button className="rounded-lg bg-brand text-white h-12 px-4 text-base">Agregar</button>
          {error && <p className="md:col-span-6 text-sm text-red-600">{error}</p>}
        </form>

        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-3">
            {items.map((x) => (
              <div key={x.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-center justify-between gap-4">
                {editing === x.id ? (
                  <div className="flex-1 grid md:grid-cols-4 gap-2">
                    <input type="date" className="rounded-lg border border-muted/40 h-10 px-3" value={(editForm.date as string) || ''} onChange={e=>setEditForm({...editForm, date: e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Concepto" value={editForm.concept || ''} onChange={e=>setEditForm({...editForm, concept: e.target.value})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Monto" value={(editForm.amount as any) || ''} onChange={e=>setEditForm({...editForm, amount: e.target.value as any})} />
                    <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Moneda" value={editForm.currency || ''} onChange={e=>setEditForm({...editForm, currency: e.target.value})} />
                  </div>
                ) : (
                  <div className="flex-1">
                    <div className="font-semibold">{x.concept} · {x.amount} {x.currency}</div>
                    <div className="text-sm text-muted">{new Date(x.date).toLocaleDateString()} {x.notes ? `· ${x.notes}` : ''}</div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  {x.receiptKey && <button className="rounded-md border h-9 px-3" type="button" onClick={async()=>{ const { url } = await apiFetch(`/expenses/${x.id}/receipt`); if (url) window.open(url,'_blank'); }}>Comprobante</button>}
                  {editing === x.id ? (
                    <>
                      <button className="rounded-md bg-brand text-white h-9 px-3" type="button" onClick={()=>saveEdit(x.id)}>Guardar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>setEditing(null)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>setEditing(x.id)}>Editar</button>
                      <button className="rounded-md border h-9 px-3" type="button" onClick={()=>onDelete(x.id)}>Eliminar</button>
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


