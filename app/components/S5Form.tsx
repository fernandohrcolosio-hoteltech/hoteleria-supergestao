"use client";
import { useState } from "react";
import { updateToolEntry } from "@/app/actions/tool-entries";
import { generateAnalysis } from "@/app/actions/ai";

interface S5FormProps {
  entryId: string;
  initialData?: { area: string; s1: string; s2: string; s3: string; s4: string; s5: string };
}

export function S5Form({ entryId, initialData }: S5FormProps) {
  const [data, setData] = useState(
    initialData || { area: "", s1: "", s2: "", s3: "", s4: "", s5: "" }
  );
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState("");

  async function handleAnalyze() {
    setLoading(true);
    const sensosText = [
      `S1 - Seiri: ${data.s1}`,
      `S2 - Seiton: ${data.s2}`,
      `S3 - Seiso: ${data.s3}`,
      `S4 - Seiketsu: ${data.s4}`,
      `S5 - Shitsuke: ${data.s5}`,
    ].join("\n");

    const { analysis: aiAnalysis } = await generateAnalysis(
      "5s",
      `Analise 5S da área: ${data.area}\n\n${sensosText}\n\nAvaliar maturidade e propor plano de ação.`
    );

    setAnalysis(aiAnalysis || "");
    await updateToolEntry(entryId, data, aiAnalysis);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={data.area}
        onChange={(e) => setData({ ...data, area: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg"
        placeholder="Qual área está sendo avaliada?"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { s: "s1", jp: "Seiri", pt: "Utilização" },
          { s: "s2", jp: "Seiton", pt: "Organização" },
          { s: "s3", jp: "Seiso", pt: "Limpeza" },
          { s: "s4", jp: "Seiketsu", pt: "Padronização" },
          { s: "s5", jp: "Shitsuke", pt: "Disciplina" },
        ].map((item) => (
          <div key={item.s} className="rounded-lg p-4 border" style={{ backgroundColor: "var(--white)" }}>
            <label className="block text-sm font-semibold mb-2" style={{ color: "var(--navy)" }}>
              {item.jp} ({item.pt})
            </label>
            <textarea
              value={data[item.s as keyof typeof data] || ""}
              onChange={(e) => setData({ ...data, [item.s]: e.target.value })}
              className="w-full px-3 py-2 border rounded text-sm"
              rows={3}
              placeholder="Observações..."
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
