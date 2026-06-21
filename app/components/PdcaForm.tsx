"use client";
import { useState } from "react";
import { updateToolEntry } from "@/app/actions/tool-entries";
import { generateAnalysis } from "@/app/actions/ai";

interface PdcaFormProps {
  entryId: string;
  initialData?: {
    tema: string;
    numero: string;
    plan: string;
    do: string;
    check: string;
    act: string;
  };
}

export function PdcaForm({ entryId, initialData }: PdcaFormProps) {
  const [data, setData] = useState(
    initialData || { tema: "", numero: "1", plan: "", do: "", check: "", act: "" }
  );
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  async function handleAnalyze() {
    setLoading(true);
    const etapasText = `PLAN: ${data.plan}\nDO: ${data.do}\nCHECK: ${data.check}\nACT: ${data.act}`;

    const { analysis: aiAnalysis } = await generateAnalysis(
      "pdca",
      `Analise ciclo PDCA #${data.numero} - Tema: ${data.tema}\n\n${etapasText}\n\nAvalie coerência e próximos passos.`
    );

    setAnalysis(aiAnalysis || "");
    await updateToolEntry(entryId, data, aiAnalysis);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          value={data.tema}
          onChange={(e) => setData({ ...data, tema: e.target.value })}
          className="px-4 py-2 border rounded-lg"
          placeholder="Tema do ciclo"
        />
        <input
          type="number"
          value={data.numero}
          onChange={(e) => setData({ ...data, numero: e.target.value })}
          className="px-4 py-2 border rounded-lg"
          placeholder="Nº do ciclo"
        />
      </div>

      <div className="space-y-4">
        {[
          { key: "plan", label: "P - Planejar", color: "#1a5276" },
          { key: "do", label: "D - Executar", color: "#1a6b4a" },
          { key: "check", label: "C - Verificar", color: "#7a5c1e" },
          { key: "act", label: "A - Agir", color: "#c0392b" },
        ].map((item) => (
          <div key={item.key} className="rounded-lg p-4 border" style={{ backgroundColor: "var(--white)" }}>
            <label className="block text-sm font-semibold mb-2" style={{ color: item.color }}>
              {item.label}
            </label>
            <textarea
              value={data[item.key as keyof typeof data] || ""}
              onChange={(e) => setData({ ...data, [item.key]: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm"
              rows={3}
              placeholder={`${item.label}...`}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full px-6 py-2 rounded-lg text-white font-semibold"
        style={{ backgroundColor: "var(--gold)" }}
      >
        {loading ? "Analisando..." : "Analisar com IA"}
      </button>

      {analysis && (
        <div className="rounded-2xl p-7" style={{ backgroundColor: "var(--navy)", color: "var(--cream)" }}>
          <div className="text-sm whitespace-pre-wrap">{analysis}</div>
        </div>
      )}
    </div>
  );
}
