"use client";
import { useState, useCallback } from "react";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [visible, setVisible] = useState(false);

  const analyze = useCallback(async (systemPrompt: string, userPrompt: string) => {
    setLoading(true);
    setVisible(true);
    setResult("");
    try {
      const resp = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, userPrompt }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) {
        setResult(`⚠ ${data.error || "Erro desconhecido da IA."}`);
      } else {
        setResult(data.text || "Sem resposta.");
      }
    } catch {
      setResult("⚠ Não foi possível conectar à IA. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setVisible(false);
    setResult("");
  }, []);

  return { analyze, loading, result, visible, reset };
}
