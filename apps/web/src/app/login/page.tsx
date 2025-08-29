"use client";
import { useState } from "react";
import { API_URL } from "@/lib/config";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error de inicio de sesión");
      }
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      // Tras login, ir al dashboard; RequireAuth redirigirá a /billing si corresponde
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
        <h1 className="text-3xl font-bold">Iniciar sesión</h1>
        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Contraseña</label>
            <input
              type="password"
              className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button disabled={loading} className="w-full rounded-md bg-black text-white px-4 py-2 font-medium hover:bg-gray-800 disabled:opacity-60">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
      <footer className="border-t border-muted/20 bg-surface mt-auto">
        <div className="mx-auto max-w-6xl px-6 py-10 flex items-center justify-center">
          <div className="text-sm text-muted">© {new Date().getFullYear()} L2E Innovation SAS</div>
        </div>
      </footer>
    </div>
  );
}
