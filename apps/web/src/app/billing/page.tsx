"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { apiFetch } from "@/lib/api";

export default function BillingPage() {
  const [acceptanceToken, setAcceptanceToken] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any | null>(null);
  const [methods, setMethods] = useState<any[]>([]);
  const [trialActive, setTrialActive] = useState<boolean>(false);
  const [cardToken, setCardToken] = useState("");
  const [nickname, setNickname] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [acc, me] = await Promise.all([
          apiFetch("/billing/acceptance-token"),
          apiFetch("/billing/me"),
        ]);
        setAcceptanceToken(acc.acceptanceToken);
        setSubscription(me.subscription);
        setMethods(me.paymentMethods || []);
        setTrialActive(!!me.trialActive);
      } catch (e: any) { setError(e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  async function addCard(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      if (!acceptanceToken) throw new Error("Falta acceptance token");
      let token = cardToken;
      if (!token && (window as any)?.Wompi) {
        const Wompi = (window as any).Wompi;
        const pub = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY;
        if (!pub) throw new Error("Falta NEXT_PUBLIC_WOMPI_PUBLIC_KEY");
        const res = await Wompi.createToken(pub, {
          number: cardNumber.replace(/\s+/g, ""),
          cvc,
          exp_month: expMonth,
          exp_year: expYear,
          card_holder: cardHolder,
        });
        token = res?.data?.id || res?.data || res?.id || token;
        if (!token) throw new Error("No se pudo obtener el token de la tarjeta");
      }
      if (!token) throw new Error("Ingresa token o datos de tarjeta");
      await apiFetch("/billing/payment-source", { method: 'POST', body: JSON.stringify({ token, acceptanceToken, nickname }) });
      const me = await apiFetch("/billing/me");
      setMethods(me.paymentMethods || []);
    } catch (e: any) { setError(e.message); }
  }

  async function startTrial() {
    setError(null);
    try {
      await apiFetch("/billing/start-trial", { method: 'POST', body: JSON.stringify({}) });
      const me = await apiFetch("/billing/me");
      setSubscription(me.subscription);
    } catch (e: any) { setError(e.message); }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <RequireAuth />
      <AppHeader />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Script src="https://cdn.wompi.co/libs/js/v1" strategy="afterInteractive" />
        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        {loading ? (
          <div className="text-muted">Cargando…</div>
        ) : (
          <div className="grid gap-6">
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="font-semibold mb-2">Estado de suscripción</div>
              <div className="text-sm">{subscription ? `${subscription.planCode} · ${subscription.status}` : 'Sin suscripción'}</div>
              {subscription?.lastChargeStatus === 'ERROR' && (
                <div className="mt-2 text-sm text-red-600">No se pudo realizar el cobro: {subscription.lastChargeError || 'revise su método de pago'}.</div>
              )}
              {subscription?.currentPeriodEnd && (
                <div className="text-xs text-muted mt-1">Próximo cobro: {new Date(subscription.currentPeriodEnd).toLocaleDateString()} · $5 USD/usuario/mes</div>
              )}
              {!trialActive && (
                <button onClick={startTrial} className="mt-3 rounded-md bg-brand text-white h-10 px-4">Iniciar prueba de 30 días</button>
              )}
            </div>
            <div className="rounded-lg border border-muted/20 bg-surface p-6">
              <div className="font-semibold mb-3">Métodos de pago</div>
              <div className="grid gap-2">
                {methods.length === 0 ? <div className="text-sm text-muted">Sin métodos de pago.</div> : methods.map(m => (
                  <div key={m.id} className="text-sm">Tarjeta (Wompi) · {m.wompiPaymentSourceId}</div>
                ))}
              </div>
              <form onSubmit={addCard} className="mt-4 grid md:grid-cols-2 gap-3">
                <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Titular de la tarjeta" value={cardHolder} onChange={e=>setCardHolder(e.target.value)} />
                <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Alias (opcional)" value={nickname} onChange={e=>setNickname(e.target.value)} />
                <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="Número de tarjeta" value={cardNumber} onChange={e=>setCardNumber(e.target.value)} />
                <div className="grid grid-cols-3 gap-3">
                  <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="MM" value={expMonth} onChange={e=>setExpMonth(e.target.value)} />
                  <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="AAAA" value={expYear} onChange={e=>setExpYear(e.target.value)} />
                  <input className="rounded-md border border-muted/40 h-10 px-3" placeholder="CVC" value={cvc} onChange={e=>setCvc(e.target.value)} />
                </div>
                <input className="rounded-md border border-muted/40 h-10 px-3 md:col-span-2" placeholder="Token (opcional, si ya lo tienes)" value={cardToken} onChange={e=>setCardToken(e.target.value)} />
                <button className="rounded-md bg-brand text-white h-10 px-3 md:col-span-2">Agregar tarjeta</button>
              </form>
              <div className="mt-2 text-xs text-muted">Los datos de tarjeta se tokenizan con Wompi y nunca tocan nuestros servidores.</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


