import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-surface/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-brand">LexControl</div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-muted hover:text-foreground">Características</a>
            <a href="#pricing" className="text-muted hover:text-foreground">Precios</a>
            <Link href="/login" className="text-muted hover:text-foreground">Iniciar sesión</Link>
            <Link href="/signup" className="rounded-md bg-brand text-white px-4 py-2 hover:opacity-90">Comenzar</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-b from-surface to-background">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-brand">
                Gestiona tus procesos judiciales con orden y sin perder plazos
              </h1>
              <p className="mt-5 text-lg text-muted">
                Centraliza expedientes, plazos, documentos y comunicación. Aumenta la confianza de tus clientes y la productividad del despacho.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-base font-medium hover:opacity-90">
                  Empieza gratis 30 días
                </Link>
                <a href="#features" className="inline-flex items-center justify-center rounded-md border border-muted/30 px-6 py-3 text-base font-medium text-foreground hover:bg-surface">
                  Ver características
                </a>
                <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-muted/30 px-6 py-3 text-base font-medium text-foreground hover:bg-surface">
                  Iniciar sesión
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted">Sin tarjeta para el trial. Cancela cuando quieras.</p>
            </div>
            <div className="rounded-xl border border-muted/20 bg-surface p-6 shadow-sm">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-muted/20 p-4">
                  <div className="text-muted">Casos activos</div>
                  <div className="mt-1 text-2xl font-bold">128</div>
                </div>
                <div className="rounded-lg border border-muted/20 p-4">
                  <div className="text-muted">Plazos esta semana</div>
                  <div className="mt-1 text-2xl font-bold">23</div>
                </div>
                <div className="rounded-lg border border-muted/20 p-4">
                  <div className="text-muted">Documentos</div>
                  <div className="mt-1 text-2xl font-bold">3.4k</div>
                </div>
                <div className="rounded-lg border border-muted/20 p-4">
                  <div className="text-muted">Audiencias</div>
                  <div className="mt-1 text-2xl font-bold">7</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA a sugerencias */}
        <section id="ideas" className="bg-background border-t border-muted/20">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand">Construyamos LexControl juntos</h2>
            <p className="mt-3 text-muted max-w-2xl mx-auto">Comparte ideas de funcionalidades que te gustaría ver. Otros colegas pueden votar y priorizaremos las más valiosas para la comunidad legal.</p>
            <div className="mt-6">
              <Link href="/ideas" className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-base font-medium hover:opacity-90">Ir al tablero de ideas</Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand">Todo lo que tu despacho necesita</h2>
            <p className="mt-3 text-muted max-w-2xl">Diseñado para despachos modernos: enfoque en cumplimiento de plazos, trazabilidad y comunicación con clientes.</p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="text-lg font-semibold">Control de plazos</h3>
                <p className="mt-2 text-muted">Calendario de audiencias, vencimientos y recordatorios automáticos para que nada se pase.</p>
              </div>
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="text-lg font-semibold">Documentos y versiones</h3>
                <p className="mt-2 text-muted">Carpetas por caso, versionado, firma digital y acceso controlado para clientes.</p>
              </div>
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="text-lg font-semibold">Actuaciones y trazabilidad</h3>
                <p className="mt-2 text-muted">Historial completo de actuaciones, resoluciones y métricas del caso.</p>
              </div>
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="text-lg font-semibold">Comunicación</h3>
                <p className="mt-2 text-muted">Registro de llamadas, correos y WhatsApp Business (integración futura).</p>
              </div>
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="text-lg font-semibold">Finanzas</h3>
                <p className="mt-2 text-muted">Honorarios, gastos, tiempos e ingresos—todo en un solo lugar.</p>
              </div>
              <div className="rounded-xl border border-muted/20 bg-surface p-6">
                <h3 className="text-lg font-semibold">Métricas</h3>
                <p className="mt-2 text-muted">Duración por tipo de proceso, éxito por abogado y alertas de riesgo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand">Precios simples</h2>
            <p className="mt-3 text-muted max-w-2xl">Empieza gratis por 30 días. Cambia o cancela cuando quieras.</p>
            <div className="mt-10 grid md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-muted/20 bg-surface p-8 shadow-sm">
                <h3 className="text-xl font-semibold">Starter</h3>
                <p className="mt-2 text-muted">Para profesionales independientes.</p>
                <div className="mt-6 text-4xl font-extrabold text-brand">$0<span className="text-base font-medium text-muted">/mes</span></div>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  <li>Hasta 5 casos</li>
                  <li>Plazos y audiencias</li>
                  <li>Documentos básicos</li>
                </ul>
                <Link href="/signup" className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-muted/30 px-4 py-2 hover:bg-surface">Comenzar</Link>
              </div>

              <div className="rounded-2xl border border-muted/20 bg-surface p-8 shadow-sm ring-2 ring-accent">
                <div className="inline-block rounded-full bg-accent px-3 py-1 text-xs text-white">Recomendado</div>
                <h3 className="mt-3 text-xl font-semibold">Pro</h3>
                <p className="mt-2 text-muted">Para equipos pequeños y medianos.</p>
                <div className="mt-6 text-4xl font-extrabold text-brand">$5<span className="text-base font-medium text-muted">/usuario/mes</span></div>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  <li>Casos ilimitados</li>
                  <li>Versionado de documentos</li>
                  <li>Recordatorios automáticos</li>
                  <li>Portal de clientes</li>
                </ul>
                <Link href="/signup" className="mt-8 inline-flex w-full items-center justify-center rounded-md bg-brand text-white px-4 py-2 hover:opacity-90">Prueba 30 días</Link>
                <p className="mt-2 text-xs text-muted">Trial sin tarjeta.</p>
              </div>

              <div className="rounded-2xl border border-muted/20 bg-surface p-8 shadow-sm">
                <h3 className="text-xl font-semibold">Enterprise</h3>
                <p className="mt-2 text-muted">Para despachos grandes y compliance.</p>
                <div className="mt-6 text-4xl font-extrabold text-brand">Custom</div>
                <ul className="mt-6 space-y-2 text-sm text-muted">
                  <li>SSO/OIDC</li>
                  <li>Retención y auditorías avanzadas</li>
                  <li>SLA y soporte dedicado</li>
                </ul>
                <a href="#contact" className="mt-8 inline-flex w-full items-center justify-center rounded-md border border-muted/30 px-4 py-2 hover:bg-surface">Contactar ventas</a>
              </div>
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contact" className="bg-surface border-t border-muted/20">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-brand">Contacto</h2>
              <p className="mt-3 text-muted max-w-xl">¿Tienes preguntas o quieres una demo? Escríbenos y te contactaremos.
              </p>
              <div className="mt-6 space-y-2 text-muted">
                <div>Email: <a className="text-brand hover:underline" href="mailto:contacto@l2e.legal">contacto@l2e.legal</a></div>
                <div>WhatsApp: <a className="text-brand hover:underline" href="#">Próximamente</a></div>
              </div>
            </div>
            <div className="rounded-xl border border-muted/20 bg-background p-6">
              <p className="text-sm text-muted">También puedes iniciar tu prueba gratuita de 30 días y explorar la plataforma.</p>
              <div className="mt-4">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-brand text-white px-6 py-3 text-base font-medium hover:opacity-90">Empezar ahora</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-muted/20 bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted">© {new Date().getFullYear()} L2E Innovation SAS</div>
          <div className="flex items-center gap-4 text-sm text-muted">
            <Link className="hover:text-foreground" href="/legal/terms">Términos</Link>
            <Link className="hover:text-foreground" href="/legal/privacy">Privacidad</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
