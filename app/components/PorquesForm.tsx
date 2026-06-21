"use client";

import { useState } from "react";
import { updateToolEntry } from "@/app/actions/tool-entries";
import { generateAnalysis, generateActionPlan } from "@/app/actions/ai";

interface PorquesFormProps {
  entryId: string;
  initialData?: {
    problema: string;
    pq1: string;
    pq2: string;
    pq3: string;
    pq4: string;
    pq5: string;
  };
}

export function PorquesForm({ entryId, initialData }: PorquesFormProps) {
  const [data, setData] = useState(
    initialData || {
      problema: "",
      pq1: "",
      pq2: "",
      pq3: "",
      pq4: "",
      pq5: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");
    setLoading(true);

    if (!data.problema.trim()) {
      setError("Preencha o problema");
      setLoading(false);
      return;
    }

    const porques = [1, 2, 3, 4, 5]
      .map((i) => `${i}º Porquê: ${data[`pq${i}` as keyof typeof data] || "(não preenchido)"}`)
      .join("\n");

    const userPrompt = `Analise esta cadeia de 5 Porquês:

PROBLEMA: ${data.problema}

CADEIA:
${porques}

Faça:
1. Avalie a lógica e coerência da cadeia
2. Verifique se a causa raiz foi realmente atingida
3. Aponte falhas ou saltos de raciocínio
4. Sugira a causa raiz real se a análise estiver incompleta
5. Proponha ações corretivas para eliminar a causa raiz
6. Sugira como evitar recorrência`;

    const { analysis: aiAnalysis, error: aiError } = await generateAnalysis(
      "porques",
      userPrompt
    );

    if (aiError) {
      setError(aiError);
      setLoading(false);
      return;
    }

    setAnalysis(aiAnalysis || "");
    await updateToolEntry(entryId, data, aiAnalysis);

    const { actionPlan: plan } = await generateActionPlan("porques", aiAnalysis || "");
    setActionPlan(plan || "");

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Problema */}
      <div
        className="rounded-2xl p-7 border"
        style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}
      >
        <label className="block text-sm font-semibold mb-3" style={{ color: "var(--navy)" }}>
          Problema Observado
        </label>
        <textarea
          value={data.problema}
          onChange={(e) => setData({ ...data, problema: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="Ex: Hóspedes reclamam que o check-in demora mais de 15 minutos"
          rows={2}
        />
      </div>

      {/* Cadeia 5 Porquês */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((n) => (
          <div
            key={n}
            className="rounded-lg p-4 border"
            style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}
          >
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
              {n}º Porquê
              {n === 5 && <span style={{ color: "var(--gold)", marginLeft: "8px" }}>← Causa Raiz</span>}
            </label>
            <input
              type="text"
              value={data[`pq${n}` as keyof typeof data] || ""}
              onChange={(e) => setData({ ...data, [`pq${n}`]: e.target.value })}
              className="w-full px-4 py-2 border rounded"
              style={{ borderColor: "var(--border)" }}
              placeholder={`${n}º porquê...`}
            />
          </div>
        ))}
      </div>

      {/* Botão */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
        style={{ backgroundColor: "var(--gold)" }}
      >
        {loading ? "Analisando..." : "Analisar com IA"}
      </button>

      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}
        >
          {error}
        </div>
      )}

      {analysis && (
        <div
          className="rounded-2xl p-7 border"
          style={{
            backgroundColor: "var(--navy)",
            borderColor: "var(--gold)",
            color: "var(--cream)",
          }}
        >
          <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--gold)" }}>
            ✨ Análise IA
          </h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{analysis}</div>
        </div>
      )}

      {actionPlan && (
        <div
          className="rounded-2xl p-7 border"
          style={{
            backgroundColor: "var(--cream)",
            borderColor: "var(--gold)",
            color: "var(--navy)",
          }}
        >
          <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--gold)" }}>
            📋 Plano de Ação
          </h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{actionPlan}</div>
        </div>
      )}
    </div>
  );
}
