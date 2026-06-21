"use client";

import { useState } from "react";
import { updateToolEntry } from "@/app/actions/tool-entries";
import { generateAnalysis, generateActionPlan } from "@/app/actions/ai";

interface IshikawaFormProps {
  entryId: string;
  initialData?: {
    problema: string;
    mao_obra: string;
    maquina: string;
    material: string;
    metodo: string;
    meio_ambiente: string;
    medicao: string;
  };
}

const CATEGORIES = [
  { id: "mao_obra", label: "Mão de Obra", color: "#c0392b" },
  { id: "maquina", label: "Máquina / Equipamento", color: "#1a6b4a" },
  { id: "material", label: "Material", color: "#1a5276" },
  { id: "metodo", label: "Método", color: "#7a5c1e" },
  { id: "meio_ambiente", label: "Meio Ambiente", color: "#6c3483" },
  { id: "medicao", label: "Medição", color: "#117a65" },
];

export function IshikawaForm({ entryId, initialData }: IshikawaFormProps) {
  const [problema, setProblema] = useState(initialData?.problema || "");
  const [categories, setCategories] = useState(
    initialData || {
      problema: "",
      mao_obra: "",
      maquina: "",
      material: "",
      metodo: "",
      meio_ambiente: "",
      medicao: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [error, setError] = useState("");

  async function handleAnalyze() {
    setError("");
    setLoading(true);

    if (!problema.trim()) {
      setError("Preencha o problema central");
      setLoading(false);
      return;
    }

    // Format data for AI
    const causasText = CATEGORIES.filter((c) => c.id !== "problema")
      .map(
        (c) =>
          `- ${c.label}: ${categories[c.id as keyof typeof categories] || "(vazio)"}`
      )
      .join("\n");

    const userPrompt = `Analise este Diagrama de Ishikawa:

PROBLEMA: ${problema}

CAUSAS IDENTIFICADAS:
${causasText}

Faça:
1. Avalie a qualidade da análise de causas
2. Identifique as causas mais críticas (priorize 2-3)
3. Sugira causas que possam ter sido esquecidas
4. Proponha ações corretivas práticas para as causas principais
5. Indique métricas para monitorar a resolução`;

    const { analysis: aiAnalysis, error: aiError } = await generateAnalysis(
      "ishikawa",
      userPrompt
    );

    if (aiError) {
      setError(aiError);
      setLoading(false);
      return;
    }

    setAnalysis(aiAnalysis || "");

    // Save analysis to database
    await updateToolEntry(entryId, categories, aiAnalysis);

    // Generate action plan
    const { actionPlan: plan, error: planError } = await generateActionPlan(
      "ishikawa",
      aiAnalysis || ""
    );

    if (!planError) {
      setActionPlan(plan || "");
    }

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
          Problema Central
        </label>
        <textarea
          value={problema}
          onChange={(e) => {
            setProblema(e.target.value);
            setCategories({ ...categories, problema: e.target.value });
          }}
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="Ex: Alta taxa de reclamações de hóspedes sobre limpeza..."
          rows={3}
        />
      </div>

      {/* Categorias 6M */}
      <div>
        <h3 className="text-lg font-serif mb-4" style={{ color: "var(--navy)" }}>
          Causas por Categoria (6M)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CATEGORIES.filter((c) => c.id !== "problema").map((cat) => (
            <div
              key={cat.id}
              className="rounded-lg p-4 border"
              style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}
            >
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: "var(--navy)" }}
              >
                <span style={{ color: cat.color, marginRight: "8px" }}>●</span>
                {cat.label}
              </label>
              <textarea
                value={categories[cat.id as keyof typeof categories] || ""}
                onChange={(e) =>
                  setCategories({
                    ...categories,
                    [cat.id]: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded text-sm"
                style={{ borderColor: "var(--border)" }}
                placeholder="Listar causas..."
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className="flex gap-3">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="px-6 py-2 rounded-lg text-white font-semibold disabled:opacity-50"
          style={{ backgroundColor: "var(--gold)" }}
        >
          {loading ? "Analisando..." : "Analisar com IA"}
        </button>
      </div>

      {/* Erro */}
      {error && (
        <div
          className="p-4 rounded-lg text-sm"
          style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}
        >
          {error}
        </div>
      )}

      {/* Análise */}
      {analysis && (
        <div
          className="rounded-2xl p-7 border"
          style={{
            backgroundColor: "var(--navy)",
            borderColor: "var(--gold)",
            color: "var(--cream)",
          }}
        >
          <h4
            className="text-sm font-semibold mb-4"
            style={{ color: "var(--gold)" }}
          >
            ✨ Análise IA
          </h4>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}

      {/* Plano de Ação */}
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
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {actionPlan}
          </div>
        </div>
      )}
    </div>
  );
}
