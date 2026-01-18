"use client";

import { useEffect } from "react";
import { initCsrfToken } from "@/lib/api";

export default function CsrfTokenProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initCsrfToken();
  }, []);

  return <>{children}</>;
}
