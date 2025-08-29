"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const [casesCount, setCasesCount] = useState<number | null>(null);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [tasksKpi, setTasksKpi] = useState<{ pending: number; dueSoon: number } | null>(null);
  const [finKpis, setFinKpis] = useState<{ hoursThisMonth: number; expensesThisMonth: number; topCases: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [billing, setBilling] = useState<{ trialActive: boolean; hasMethod: boolean; subscription?: any } | null>(null);
  const [chargeMsg, setChargeMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [casesRes, deadlines, tasks, fin, me] = await Promise.all([
          apiFetch("/cases?status=ACTIVO&page=1&pageSize=1"),
          apiFetch("/deadlines/upcoming?days=14"),
          apiFetch("/case-tasks/summary"),
          apiFetch("/stats/dashboard"),
          apiFetch("/billing/me"),
        ]);
        const activeCount = (casesRes as any)?.total ?? (Array.isArray(casesRes) ? casesRes.length : 0);
        setCasesCount(activeCount);
        setUpcoming(deadlines);
        setTasksKpi(tasks);
        setFinKpis(fin);
        setBilling({ trialActive: !!me.trialActive, hasMethod: !!me.hasMethod, subscription: me.subscription });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await apiFetch(`/cases${search ? `?q=${encodeURIComponent(search)}` : ''}`);
      const data = Array.isArray((res as any).data) ? (res as any).data : (Array.isArray(res) ? res : []);
      setResults(data.slice(0, 5));
    } catch (e: any) { setError(e.message); }
  }

  function daysLeft(dateStr?: string) {
    if (!dateStr) return null;
    const now = new Date();
    const end = new Date(dateStr);
    const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }

  async function payNow() {
    setChargeMsg(null);
    try {
      const res = await apiFetch('/billing/charge-now', { method: 'POST' });
      setChargeMsg(res?.status ? `Cobro: ${res.status}` : 'Cobro enviado');
    } catch (e: any) {
      setChargeMsg(e.message || 'Error al cobrar');
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {billing?.trialActive && (
              <div className="md:col-span-4 rounded-lg border border-yellow-300/40 bg-yellow-50 text-yellow-900 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Tu prueba está activa</div>
                    {billing?.subscription?.trialEndsAt && (
                      <div className="text-sm">Te quedan {daysLeft(billing.subscription.trialEndsAt)} días · vence el {new Date(billing.subscription.trialEndsAt).toLocaleDateString()}</div>
                    )}
                  </div>
                  {billing?.hasMethod ? (
                    <button onClick={payNow} className="rounded-md bg-brand text-white h-10 px-3">Pagar ahora</button>
                  ) : (
                    <Link className="rounded-md bg-brand text-white h-10 px-3 flex items-center" href="/billing">Agregar método de pago</Link>
                  )}
                </div>
                {chargeMsg && <div className="mt-2 text-sm">{chargeMsg}</div>}
              </div>
            )}
            <div className="md:col-span-4">
              <form onSubmit={onSearch} className="rounded-lg border border-muted/30 bg-surface p-4 flex items-center gap-3">
                <input className="flex-1 rounded-md border border-muted/40 h-10 px-3" placeholder="Buscar casos (expediente o título, nombre de cliente, etc)" value={search} onChange={e=>setSearch(e.target.value)} />
                <button className="rounded-md bg-brand text-white h-10 px-3">Buscar</button>
              </form>
              {results.length > 0 && (
                <div className="mt-2 rounded-lg border border-muted/20 bg-surface p-3">
                  {results.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-sm py-1">
                      <div className="truncate">{r.title} · {r.expedienteNumber}</div>
                      <Link className="text-brand hover:underline" href={`/cases/${r.id}`}>Abrir</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="text-muted">Casos activos</div>
              <div className="mt-2 text-3xl font-bold">{casesCount ?? '—'}</div>
              <Link className="mt-3 inline-block text-brand hover:underline" href="/cases">Ver casos</Link>
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6 md:col-span-2">
              <div className="font-semibold">Próximos 14 días</div>
              <div className="mt-4 grid gap-3">
                {upcoming.length === 0 ? (
                  <div className="text-muted text-sm">Sin plazos próximos.</div>
                ) : (
                  upcoming.map((d) => (
                    <div key={d.id} className="rounded-md border border-muted/20 p-3 flex items-center justify-between">
                      <div>
                        <div className="font-medium">{d.title}</div>
                        <div className="text-xs text-muted">{new Date(d.dueAt).toLocaleString()}</div>
                      </div>
                      <Link className="text-brand text-sm hover:underline" href={`/cases/${d.caseId}`}>Abrir caso</Link>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="text-muted">Tareas pendientes</div>
              <div className="mt-2 text-3xl font-bold">{tasksKpi?.pending ?? '—'}</div>
              <Link className="mt-3 inline-block text-brand hover:underline" href="/cases">Ver tareas</Link>
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="text-muted">Por vencer (7 días)</div>
              <div className="mt-2 text-3xl font-bold">{tasksKpi?.dueSoon ?? '—'}</div>
              <Link className="mt-3 inline-block text-brand hover:underline" href="/cases">Ver tareas</Link>
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="text-muted">Horas este mes</div>
              <div className="mt-2 text-3xl font-bold">{finKpis ? finKpis.hoursThisMonth.toFixed(1) : '—'}</div>
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="text-muted">Gastos este mes (COP)</div>
              <div className="mt-2 text-3xl font-bold">{finKpis ? finKpis.expensesThisMonth.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) : '—'}</div>
            </div>
            <div className="md:col-span-4 rounded-lg border border-muted/20 bg-surface p-6">
              <div className="font-semibold mb-3">Top casos por horas (mes actual)</div>
              <div className="grid gap-2">
                {finKpis?.topCases?.length ? finKpis.topCases.map((t:any) => (
                  <div key={t.caseId} className="flex items-center justify-between text-sm">
                    <div className="truncate">
                      {t.case?.title || 'Caso'} · {t.case?.expedienteNumber || t.caseId}
                    </div>
                    <div className="text-muted">{t.hours.toFixed(1)} h</div>
                  </div>
                )) : (
                  <div className="text-sm text-muted">Sin datos.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


