import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


