"use client";

import { useState } from "react";
import { updateToolEntry } from "@/app/actions/tool-entries";
import { generateAnalysis, generateActionPlan } from "@/app/actions/ai";

interface SmartFormProps {
  entryId: string;
  initialData?: {
    rascunho: string;
    s: string;
    m: string;
    a: string;
    r: string;
    t: string;
  };
}

export function SmartForm({ entryId, initialData }: SmartFormProps) {
  const [data, setData] = useState(
    initialData || {
      rascunho: "",
      s: "",
      m: "",
      a: "",
      r: "",
      t: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");
    setLoading(true);

    const campos = `Específica (S): ${data.s || "-"}\nMensurável (M): ${data.m || "-"}\nAtingível (A): ${data.a || "-"}\nRelevante (R): ${data.r || "-"}\nTemporal (T): ${data.t || "-"}`;

    const userPrompt = `Avalie e aprimore esta meta SMART:

RASCUNHO: ${data.rascunho || "-"}

CRITÉRIOS:
${campos}

Faça:
1. Avalie cada critério SMART com nota e comentário
2. Reescreva a meta de forma completa e SMART
3. Sugira KPIs para monitoramento
4. Identifique riscos de não atingimento
5. Proponha marcos (milestones) intermediários`;

    const { analysis: aiAnalysis, error: aiError } = await generateAnalysis("smart", userPrompt);

    if (aiError) {
      setError(aiError);
      setLoading(false);
      return;
    }

    setAnalysis(aiAnalysis || "");
    await updateToolEntry(entryId, data, aiAnalysis);

    const { actionPlan: plan } = await generateActionPlan("smart", aiAnalysis || "");
    setActionPlan(plan || "");

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      {/* Rascunho */}
      <div className="rounded-2xl p-7 border" style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}>
        <label className="block text-sm font-semibold mb-3" style={{ color: "var(--navy)" }}>
          Rascunho da Meta
        </label>
        <textarea
          value={data.rascunho}
          onChange={(e) => setData({ ...data, rascunho: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="Descreva sua meta de forma inicial..."
          rows={2}
        />
      </div>

      {/* SMART */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "s", label: "Específica (S)", desc: "Bem definida e clara?" },
          { key: "m", label: "Mensurável (M)", desc: "Tem métricas?" },
          { key: "a", label: "Atingível (A)", desc: "É realista?" },
          { key: "r", label: "Relevante (R)", desc: "Alinhada aos objetivos?" },
          { key: "t", label: "Temporal (T)", desc: "Tem prazo?" },
        ].map((item) => (
          <div key={item.key} className="rounded-lg p-4 border" style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--navy)" }}>
              {item.label}
            </label>
            <p className="text-xs mb-2" style={{ color: "var(--text-muted)" }}>
              {item.desc}
            </p>
            <textarea
              value={data[item.key as keyof typeof data] || ""}
              onChange={(e) => setData({ ...data, [item.key]: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm"
              style={{ borderColor: "var(--border)" }}
              rows={2}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
        style={{ backgroundColor: "var(--gold)" }}
      >
        {loading ? "Analisando..." : "Analisar com IA"}
      </button>

      {error && <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}>{error}</div>}

      {analysis && (
        <div className="rounded-2xl p-7 border" style={{ backgroundColor: "var(--navy)", borderColor: "var(--gold)", color: "var(--cream)" }}>
          <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--gold)" }}>✨ Análise IA</h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{analysis}</div>
        </div>
      )}

      {actionPlan && (
        <div className="rounded-2xl p-7 border" style={{ backgroundColor: "var(--cream)", borderColor: "var(--gold)", color: "var(--navy)" }}>
          <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--gold)" }}>📋 Plano de Ação</h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{actionPlan}</div>
        </div>
      )}
    </div>
  );
}
