"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

export default function CaseDetailPage() {
  const params = useParams<{ id: string }>();
  const caseId = params.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quick, setQuick] = useState<{ title: string; dueAt: string }>({ title: '', dueAt: '' });
  const [quickError, setQuickError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await apiFetch(`/cases/${caseId}/summary`);
        setData(res);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [caseId]);

  async function createQuickDeadline(e: React.FormEvent) {
    e.preventDefault();
    setQuickError(null);
    try {
      await apiFetch(`/deadlines`, { method: 'POST', body: JSON.stringify({ caseId, title: quick.title, dueAt: quick.dueAt }) });
      setQuick({ title: '', dueAt: '' });
      // Recargar resumen
      const res = await apiFetch(`/cases/${caseId}/summary`);
      setData(res);
    } catch (e: any) { setQuickError(e.message); }
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
          data && (
            <div className="grid gap-6">
              <div className="rounded-lg border border-muted/20 bg-surface p-6">
                <div className="text-xs text-muted">Expediente</div>
                <div className="text-2xl font-bold">{data.case.expedienteNumber}</div>
                <div className="text-muted mt-1">{data.case.title}</div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-lg border border-muted/20 bg-surface p-6">
                  <div className="text-muted">Próximos plazos</div>
                  <div className="mt-2 text-3xl font-bold">{data.kpis.upcomingDeadlines}</div>
                </div>
                <div className="rounded-lg border border-muted/20 bg-surface p-6">
                  <div className="text-muted">Próximas audiencias</div>
                  <div className="mt-2 text-3xl font-bold">{data.kpis.upcomingHearings}</div>
                </div>
                <div className="rounded-lg border border-muted/20 bg-surface p-6">
                  <div className="text-muted">Documentos</div>
                  <div className="mt-2 text-3xl font-bold">{data.kpis.documentsCount}</div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-lg border border-muted/20 bg-surface p-6">
                  <div className="text-muted">Horas totales</div>
                  <div className="mt-2 text-3xl font-bold">{(data.kpis.hoursTotal ?? 0).toFixed ? (data.kpis.hoursTotal).toFixed(1) : data.kpis.hoursTotal}</div>
                  <div className="mt-3">
                    <Link className="text-brand hover:underline text-sm" href={`/cases/${caseId}/time`}>Ver tiempo</Link>
                  </div>
                </div>
                <div className="rounded-lg border border-muted/20 bg-surface p-6">
                  <div className="text-muted">Horas facturables</div>
                  <div className="mt-2 text-3xl font-bold">{(data.kpis.hoursBillable ?? 0).toFixed ? (data.kpis.hoursBillable).toFixed(1) : data.kpis.hoursBillable}</div>
                </div>
                <div className="rounded-lg border border-muted/20 bg-surface p-6">
                  <div className="text-muted">Gastos (COP)</div>
                  <div className="mt-2 text-3xl font-bold">{(data.kpis.expensesTotal ?? 0).toLocaleString?.('es-CO', { style: 'currency', currency: 'COP' }) || data.kpis.expensesTotal}</div>
                  <div className="mt-3">
                    <Link className="text-brand hover:underline text-sm" href={`/cases/${caseId}/expenses`}>Ver gastos</Link>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-muted/20 bg-surface p-6">
                <div className="font-semibold mb-3">Últimos documentos</div>
                <div className="grid gap-2">
                  {data.recentDocuments.map((d: any) => (
                    <div key={d.id} className="flex items-center justify-between text-sm">
                      <div>{d.name}</div>
                      <Link className="text-brand hover:underline" href={`/cases/${caseId}/documents`}>Ver</Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-muted/20 bg-surface p-6">
                <div className="font-semibold mb-3">Próximos 14 días</div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted mb-2">Plazos</div>
                    <div className="grid gap-2">
                      {data.upcomingDeadlines.map((x: any) => (
                        <div key={x.id} className="text-sm">{x.title} · {new Date(x.dueAt).toLocaleString()}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted mb-2">Audiencias</div>
                    <div className="grid gap-2">
                      {data.upcomingHearings.map((x: any) => (
                        <div key={x.id} className="text-sm">{x.type || 'Audiencia'} · {new Date(x.date).toLocaleString()}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-muted/20 bg-surface p-6">
                <div className="font-semibold mb-3">Acceso rápido</div>
                <form onSubmit={createQuickDeadline} className="grid md:grid-cols-3 gap-3">
                  <input className="rounded-lg border border-muted/40 h-10 px-3" placeholder="Nuevo plazo: título" value={quick.title} onChange={e=>setQuick({...quick, title:e.target.value})} required />
                  <input type="datetime-local" className="rounded-lg border border-muted/40 h-10 px-3" value={quick.dueAt} onChange={e=>setQuick({...quick, dueAt:e.target.value})} required />
                  <button className="rounded-md bg-brand text-white h-10 px-3">Crear plazo</button>
                  {quickError && <p className="md:col-span-3 text-sm text-red-600">{quickError}</p>}
                </form>
                <div className="mt-3 text-xs text-muted">Más opciones en <Link className="text-brand hover:underline" href={`/cases/${caseId}/deadlines`}>Plazos</Link> y <Link className="text-brand hover:underline" href={`/cases/${caseId}/hearings`}>Audiencias</Link>.</div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/documents`}>Documentos</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/hearings`}>Audiencias</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/parties`}>Partes</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/team`}>Equipo</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/timeline`}>Timeline</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/tasks`}>Tareas</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/time`}>Tiempo</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/expenses`}>Gastos</Link>
                <Link className="rounded-md border h-10 px-3 flex items-center" href={`/cases/${caseId}/deadlines`}>Plazos</Link>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}


