"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AppHeader() {
  const router = useRouter();
  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }
  return (
    <header className="border-b bg-surface/80 backdrop-blur sticky top-0 z-30">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="font-bold text-xl text-brand cursor-pointer" onClick={() => router.push("/dashboard")}>LexControl</div>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/dashboard" className="text-muted hover:text-foreground">Dashboard</Link>
          <Link href="/cases" className="text-muted hover:text-foreground">Casos</Link>
          <Link href="/clients" className="text-muted hover:text-foreground">Clientes</Link>
          <Link href="/deadlines" className="text-muted hover:text-foreground">Plazos</Link>
          <Link href="/hearings" className="text-muted hover:text-foreground">Audiencias</Link>
          <Link href="/calendar" className="text-muted hover:text-foreground">Calendario</Link>
          <Link href="/billing" className="text-muted hover:text-foreground">Facturación</Link>
          <button onClick={logout} className="rounded-md border h-9 px-3">Cerrar sesión</button>
        </nav>
      </div>
    </header>
  );
}


