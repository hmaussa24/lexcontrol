"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export function RequireAuth() {
  const router = useRouter();
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    (async () => {
      try {
        const me = await apiFetch("/billing/me");
        if (me?.shouldRedirectToBilling && window.location.pathname !== "/billing") {
          router.replace("/billing");
        }
      } catch {}
    })();
  }, [router]);
  return null;
}


