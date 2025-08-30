import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Línea de tiempo del caso",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


