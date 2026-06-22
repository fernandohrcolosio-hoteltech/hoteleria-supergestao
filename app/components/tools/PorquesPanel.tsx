"use client";
import { useState } from "react";
import { useAI } from "@/app/hooks/useAI";
import { AIOutput } from "./AIOutput";
import { ActionPlan } from "./ActionPlan";
import { s, card, btnGold, btnOutline, toolHeader } from "./styles";

const EMPTY_PQS = { p1: "", p2: "", p3: "", p4: "", p5: "" };

export function PorquesPanel() {
  const [problema, setProblema] = useState("");
  const [pqs, setPqs] = useState(EMPTY_PQS);
  const { analyze, loading, result, visible, reset } = useAI();

  function handleAnalyze() {
    if (!problema) { alert("Preencha o problema."); return; }
    const chain = [pqs.p1, pqs.p2, pqs.p3, pqs.p4, pqs.p5]
      .filter(v => v.trim())
      .map((p, i) => `${i + 1}º Porquê: ${p}`)
      .join("\n");
    analyze(
      `Você é um especialista em análise de causa raiz e metodologia Toyota/Lean com experiência em hotelaria e gestão de operações. Avalie cadeias de 5 Porquês com rigor técnico e visão prática. Responda sempre em português brasileiro.`,
      `Analise esta cadeia de 5 Porquês:\n\nPROBLEMA: ${problema}\n\nCADEIA:\n${chain || "Nenhum porquê preenchido"}\n\nFaça:\n1. Avalie a lógica e coerência da cadeia\n2. Verifique se a causa raiz foi realmente atingida\n3. Aponte falhas ou saltos de raciocínio\n4. Sugira a causa raiz real se a análise estiver incompleta\n5. Proponha ações corretivas para eliminar a causa raiz\n6. Sugira como evitar recorrência`
    );
  }

  const steps = [
    { key: "p1", num: "1", label: "Por quê o problema ocorre?", gold: false },
    { key: "p2", num: "2", label: "Por quê isso acontece?", gold: false },
    { key: "p3", num: "3", label: "Por quê isso acontece?", gold: false },
    { key: "p4", num: "4", label: "Por quê isso acontece?", gold: false },
    { key: "p5", num: "5", label: "Por quê isso acontece?", gold: true },
  ];

  return (
    <div>
      <div style={toolHeader}>
        <div style={s.badge}>Análise de Causa Raiz</div>
        <h1 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 6, lineHeight: 1.1 }}>5 Porquês</h1>
        <p style={s.desc}>Aprofunde-se em um problema perguntando "Por quê?" repetidamente até encontrar a causa raiz. Técnica desenvolvida por Sakichi Toyoda na Toyota.</p>
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Definição do Problema</div>
        <label style={s.label}>Qual é o problema observado?</label>
        <input style={s.input} type="text" value={problema} onChange={e => setProblema(e.target.value)}
          placeholder="Ex: Hóspedes reclamam que o check-in demora mais de 15 minutos" />
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Cadeia dos 5 Porquês</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {steps.map((step, idx) => (
            <div key={step.key} style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
                <div style={{
                  width: 32, height: 32,
                  background: step.gold ? "var(--gold)" : "var(--navy)",
                  color: step.gold ? "var(--navy)" : "var(--white)",
                  borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                }}>
                  {step.num}
                </div>
                {idx < 4 && <div style={{ width: 2, background: "var(--border)", flex: 1, minHeight: 16 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 20, paddingTop: 4 }}>
                <label style={s.label}>
                  {step.label}
                  {step.gold && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)", background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 12px", marginLeft: 8, fontStyle: "italic" }}>
                      causa raiz
                    </span>
                  )}
                </label>
                <input
                  style={{ ...s.input, background: "var(--white)" }}
                  type="text"
                  value={pqs[step.key as keyof typeof pqs]}
                  onChange={e => setPqs(prev => ({ ...prev, [step.key]: e.target.value }))}
                  placeholder={step.gold ? "Causa raiz..." : `${step.num}º porquê...`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.actionsRow}>
        <button style={btnGold} onClick={handleAnalyze}>⟳ Analisar com IA</button>
        <button style={btnOutline} onClick={() => { setProblema(""); setPqs(EMPTY_PQS); reset(); }}>Limpar</button>
      </div>

      <AIOutput visible={visible} loading={loading} result={result} />
      <ActionPlan
        toolSlug="porques"
        getContext={() => {
          const chain = [pqs.p1, pqs.p2, pqs.p3, pqs.p4, pqs.p5]
            .filter(v => v.trim())
            .map((p, i) => `${i + 1}º Porquê: ${p}`)
            .join("\n");
          return `Problema: ${problema}\n\nCadeia de 5 Porquês:\n${chain || "Não preenchida"}`;
        }}
      />
    </div>
  );
}
