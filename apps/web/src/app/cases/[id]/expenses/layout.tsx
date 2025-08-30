import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gastos del caso",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


