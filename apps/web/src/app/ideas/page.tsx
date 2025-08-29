"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";

type Suggestion = { id: string; name: string; email: string; content: string; votesCount: number; createdAt: string };

export default function IdeasPage() {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", content: "" });
  const [sort, setSort] = useState<'new'|'top'>('top');
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const captchaRef = useRef<HTMLDivElement | null>(null);
  const [widgetId, setWidgetId] = useState<any>(null);

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

  useEffect(() => {
    (window as any).onHCaptchaLoad = () => {
      setCaptchaReady(true);
      const hc = (window as any).hcaptcha;
      if (hc && captchaRef.current && !widgetId) {
        const id = hc.render(captchaRef.current, {
          sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY,
          callback: (token: string) => setCaptchaToken(token),
          "expired-callback": () => setCaptchaToken(""),
        });
        setWidgetId(id);
      }
    };
  }, [widgetId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const hc = (window as any).hcaptcha;
      if (!captchaToken && hc && widgetId != null) {
        const resp = hc.getResponse(widgetId);
        if (resp) setCaptchaToken(resp);
      }
      if (!captchaToken) throw new Error("Completa el captcha");
      await apiFetch("/public/suggestions", { method: 'POST', body: JSON.stringify({ ...form, captchaToken }) });
      setForm({ name: "", email: "", content: "" });
      setCaptchaToken("");
      if ((window as any).hcaptcha?.reset && widgetId != null) (window as any).hcaptcha.reset(widgetId);
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-brand">LexControl</div>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-muted hover:text-foreground">Inicio</Link>
            <Link href="/login" className="text-muted hover:text-foreground">Iniciar sesión</Link>
            <Link href="/signup" className="rounded-md bg-brand text-white px-4 py-2 hover:opacity-90">Comenzar</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 grid gap-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand">Tablero de ideas de la comunidad</h1>
          <p className="mt-2 text-muted max-w-3xl">Agrega tu sugerencia y vota las ideas de otros abogados. Esto nos ayuda a priorizar en función del impacto real en la práctica legal.</p>
        </div>

        <div className="rounded-xl border border-muted/20 bg-surface p-6">
          <div className="font-semibold">Comparte tu idea</div>
          <p className="text-sm text-muted mt-1">Sé específico y cuéntanos el problema que resuelve. ¡Gracias por construir con nosotros!</p>
          <form onSubmit={submit} className="mt-4 grid md:grid-cols-2 gap-3">
            <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Tu nombre" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Tu email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            <textarea className="md:col-span-2 rounded-md border border-muted/40 min-h-[120px] p-3" placeholder="Describe tu idea..." value={form.content} onChange={e=>setForm({...form, content:e.target.value})} required />
            <div className="md:col-span-2">
              <div ref={captchaRef} className="h-captcha"></div>
            </div>
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
      </main>

      <Script src="https://js.hcaptcha.com/1/api.js?onload=onHCaptchaLoad&render=explicit" strategy="afterInteractive" />
    </div>
  );
}


