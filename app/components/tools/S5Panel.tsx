"use client";
import { useState } from "react";
import { useAI } from "@/app/hooks/useAI";
import { AIOutput } from "./AIOutput";
import { s, card, btnGold, btnOutline, toolHeader } from "./styles";

type Status = "red" | "yellow" | "green" | null;

const SENSOS = [
  { num: 1, jp: "Seiri", pt: "Utilização", color: "#c0392b", placeholder: "O que é necessário? O que deve ser descartado ou realocado?" },
  { num: 2, jp: "Seiton", pt: "Organização", color: "#1a5276", placeholder: "Cada coisa tem um lugar definido e identificado?" },
  { num: 3, jp: "Seiso", pt: "Limpeza", color: "#1a6b4a", placeholder: "O ambiente está limpo? Há rotina de limpeza definida?" },
  { num: 4, jp: "Seiketsu", pt: "Padronização", color: "#7a5c1e", placeholder: "Existem padrões visuais e procedimentos claros e replicáveis?" },
  { num: 5, jp: "Shitsuke", pt: "Disciplina", color: "#6c3483", placeholder: "A equipe mantém os padrões sem precisar de cobrança constante?" },
];

const STATUS_LABEL: Record<string, string> = { red: "CRÍTICO", yellow: "ATENÇÃO", green: "OK" };

export function S5Panel() {
  const [area, setArea] = useState("");
  const [textos, setTextos] = useState<Record<number, string>>({ 1: "", 2: "", 3: "", 4: "", 5: "" });
  const [statuses, setStatuses] = useState<Record<number, Status>>({ 1: null, 2: null, 3: null, 4: null, 5: null });
  const { analyze, loading, result, visible, reset } = useAI();

  function setStatus(num: number, status: Status) {
    setStatuses(prev => ({ ...prev, [num]: status }));
  }

  function handleAnalyze() {
    if (!area) { alert("Preencha a área avaliada."); return; }
    const sensosText = SENSOS.map(s =>
      `${s.jp} - ${s.pt} [${STATUS_LABEL[statuses[s.num] || ""] || "NÃO AVALIADO"}]: ${textos[s.num] || "(sem observação)"}`
    ).join("\n");
    analyze(
      `Você é um especialista em metodologia 5S e gestão de qualidade com experiência em hotelaria e operações de housekeeping/governança. Analise avaliações 5S com rigor técnico e visão prática de implementação. Responda sempre em português brasileiro.`,
      `Analise esta avaliação 5S:\n\nÁREA: ${area}\n\nSENSOS:\n${sensosText}\n\nFaça:\n1. Avalie o nível de maturidade 5S geral da área (iniciante / em desenvolvimento / maduro)\n2. Identifique os sensos mais críticos que precisam de ação imediata\n3. Aponte se algum senso está sendo negligenciado em relação aos outros\n4. Proponha um plano de ação com prioridades para as próximas 2 semanas\n5. Sugira como sustentar o Shitsuke (disciplina) a longo prazo`
    );
  }

  function handleClear() {
    setArea("");
    setTextos({ 1: "", 2: "", 3: "", 4: "", 5: "" });
    setStatuses({ 1: null, 2: null, 3: null, 4: null, 5: null });
    reset();
  }

  return (
    <div>
      <div style={toolHeader}>
        <div style={s.badge}>Organização e Padronização</div>
        <h1 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 6, lineHeight: 1.1 }}>Programa 5S</h1>
        <p style={s.desc}>Metodologia japonesa de organização do ambiente de trabalho. Avalie cada senso e construa um plano de ação.</p>
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Área / Setor em Avaliação</div>
        <label style={s.label}>Qual área você está avaliando?</label>
        <input style={s.input} type="text" value={area} onChange={e => setArea(e.target.value)}
          placeholder="Ex: Copa de governança do VHouse Faria Lima" />
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Avaliação por Senso</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 16 }}>
          {SENSOS.map(senso => (
            <div key={senso.num} style={{
              background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 12, padding: "18px 16px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: senso.color }} />
              <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 2, marginTop: 8 }}>{senso.jp}</div>
              <div className="font-serif" style={{ fontSize: 28, color: "var(--navy)", lineHeight: 1 }}>S{senso.num}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 10 }}>{senso.pt}</div>
              <textarea
                style={{ ...s.textarea, minHeight: 90, background: "var(--white)", fontSize: 13 }}
                value={textos[senso.num]}
                onChange={e => setTextos(prev => ({ ...prev, [senso.num]: e.target.value }))}
                placeholder={senso.placeholder}
              />
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                {(["red", "yellow", "green"] as const).map(st => {
                  const labels = { red: "Crítico", yellow: "Atenção", green: "OK" };
                  const activeStyles = {
                    red: { background: "#fde8e8", borderColor: "#c0392b", color: "#c0392b" },
                    yellow: { background: "var(--gold-pale, #f5e9c8)", borderColor: "var(--gold)", color: "#7a5c1e" },
                    green: { background: "#e0f5ec", borderColor: "#1a6b4a", color: "#1a6b4a" },
                  };
                  const isActive = statuses[senso.num] === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setStatus(senso.num, st)}
                      style={{
                        flex: 1,
                        border: "1px solid var(--border)",
                        background: "var(--white)",
                        borderRadius: 6,
                        padding: "5px 0",
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: "pointer",
                        color: "var(--text-muted)",
                        ...(isActive ? activeStyles[st] : {}),
                      }}
                    >
                      {labels[st]}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={s.actionsRow}>
        <button style={btnGold} onClick={handleAnalyze}>⟳ Analisar com IA</button>
        <button style={btnOutline} onClick={handleClear}>Limpar</button>
      </div>

      <AIOutput visible={visible} loading={loading} result={result} />
    </div>
  );
}
