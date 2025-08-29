"use client";
import { useState } from "react";
import { API_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ organizationName: "", name: "", email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error en registro");
      }
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Tras signup se inicia trial automáticamente en backend. Ir al dashboard;
      // RequireAuth redirigirá a /billing si venció el trial y no hay método.
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b bg-surface/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="font-bold text-xl text-brand">LexControl</div>
        </div>
      </header>
      <div className="mx-auto max-w-lg px-6 py-16 flex-1">
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-gray-600">Empieza tu prueba gratuita de 30 días. No necesitas tarjeta.</p>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium">Nombre del despacho</label>
            <input
              className="mt-1 w-full rounded-lg border border-muted/40 h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              placeholder="Ej. Gómez & Asociados"
              value={form.organizationName}
              onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tu nombre</label>
            <input
              className="mt-1 w-full rounded-lg border border-muted/40 h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              placeholder="Nombre y apellido"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg border border-muted/40 h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              placeholder="tu@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg border border-muted/40 h-12 px-4 text-base focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand"
              placeholder="●●●●●●●●"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button disabled={loading} className="w-full rounded-lg bg-brand text-white h-12 px-4 text-base font-medium hover:opacity-90 disabled:opacity-60">
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <p className="mt-4 text-xs text-muted">Al continuar aceptas nuestros términos y política de privacidad.</p>
      </div>
      <footer className="border-t border-muted/20 bg-surface mt-auto">
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-center">
          <div className="text-sm text-muted">© {new Date().getFullYear()} L2E Innovation SAS</div>
        </div>
      </footer>
    </div>
  );
}
