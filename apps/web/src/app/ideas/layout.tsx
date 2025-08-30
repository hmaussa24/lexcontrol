import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ideas de la comunidad",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}


