"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Suggestion = { id: string; name: string; email: string; content: string; votesCount: number; createdAt: string };

export function IdeasBoard() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", content: "", captchaToken: "" });
  const [sort, setSort] = useState<'new'|'top'>('top');

  async function load() {
    try {
      setLoading(true);
      const res = await apiFetch(`/public/suggestions?sort=${sort}`);
      setItems(res.data || res);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [sort]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!form.captchaToken) throw new Error("Completa el captcha");
      await apiFetch("/public/suggestions", { method: 'POST', body: JSON.stringify(form) });
      setForm({ name: "", email: "", content: "", captchaToken: "" });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  async function vote(id: string) {
    try {
      await apiFetch(`/public/suggestions/${id}/vote`, { method: 'POST', body: JSON.stringify({ email: form.email || undefined }) });
      await load();
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="mt-8 grid gap-6">
      <div className="rounded-xl border border-muted/20 bg-surface p-6">
        <div className="font-semibold">Comparte tu idea</div>
        <p className="text-sm text-muted mt-1">Cuéntanos qué te gustaría que construyamos. ¡Tu voto y el de la comunidad nos ayudan a priorizar!</p>
        <form onSubmit={submit} className="mt-4 grid md:grid-cols-2 gap-3">
          <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Tu nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
          <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Tu email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
          <textarea className="md:col-span-2 rounded-md border border-muted/40 min-h-[100px] p-3" placeholder="Describe tu idea..." value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required />
          {/* hCaptcha placeholder: el integrador debe establecer el token */}
          <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Captcha token" value={form.captchaToken} onChange={e=>setForm({...form, captchaToken:e.target.value})} required />
          <button className="rounded-md bg-brand text-white h-10 px-3">Enviar sugerencia</button>
          {error && <div className="md:col-span-2 text-sm text-red-600">{error}</div>}
        </form>
      </div>

      <div className="flex items-center justify-between">
        <div className="font-semibold">Ideas de la comunidad</div>
        <select className="rounded-md border border-muted/40 h-9 px-3 text-sm" value={sort} onChange={e=>setSort(e.target.value as any)}>
          <option value="top">Más votadas</option>
          <option value="new">Más recientes</option>
        </select>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <div className="text-muted text-sm">Cargando…</div>
        ) : items.length === 0 ? (
          <div className="text-muted text-sm">Aún no hay sugerencias. ¡Sé el primero en dejar la tuya!</div>
        ) : items.map((s) => (
          <div key={s.id} className="rounded-lg border border-muted/20 bg-surface p-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm text-muted">Por {s.name}</div>
              <div className="mt-1">{s.content}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-muted">{s.votesCount} votos</div>
              <button onClick={()=>vote(s.id)} className="rounded-md border h-9 px-3 text-sm">Votar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


