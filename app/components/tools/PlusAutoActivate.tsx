"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Props {
  toolSlug: string;
  onActivated: () => void;
}

export function PlusAutoActivate({ toolSlug, onActivated }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("ativar");
    if (!code) return;

    fetch("/api/plus/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, tool_slug: toolSlug }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          // Remove o parâmetro da URL sem recarregar a página
          const url = new URL(window.location.href);
          url.searchParams.delete("ativar");
          router.replace(url.pathname + url.search, { scroll: false });
          onActivated();
        }
      })
      .catch(() => {}); // Falha silenciosa — usuário pode ativar manualmente
  }, []);

  return null;
}
