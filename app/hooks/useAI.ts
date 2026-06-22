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
      setResult(data.text || data.error || "Erro na resposta.");
    } catch {
      setResult("Erro ao conectar com a IA.");
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
