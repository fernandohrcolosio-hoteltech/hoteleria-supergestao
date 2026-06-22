"use client";
import { useState } from "react";
import { useAI } from "@/app/hooks/useAI";
import { AIOutput } from "./AIOutput";
import { s, card, btnGold, btnOutline, toolHeader } from "./styles";

const ETAPAS = [
  { key: "plan", letter: "P", name: "Plan — Planejar", sub: "Defina o problema, metas e plano de ação", color: "#1a5276", placeholder: "O que será feito? Quais metas? Qual prazo? Quem é responsável?" },
  { key: "do", letter: "D", name: "Do — Executar", sub: "Implemente o plano em pequena escala ou piloto", color: "#1a6b4a", placeholder: "O que foi executado? Como foi a implementação? Houve desvios do plano?" },
  { key: "check", letter: "C", name: "Check — Verificar", sub: "Compare resultados com as metas planejadas", color: "#7a5c1e", placeholder: "Os resultados bateram a meta? Quais indicadores confirmam isso?" },
  { key: "act", letter: "A", name: "Act — Agir", sub: "Padronize o que funcionou ou ajuste e reinicie o ciclo", color: "#c0392b", placeholder: "O que será padronizado? O que precisa ser ajustado no próximo ciclo?" },
];

const EMPTY = { tema: "", numero: "1", plan: "", do: "", check: "", act: "" };

export function PdcaPanel() {
  const [form, setForm] = useState(EMPTY);
  const { analyze, loading, result, visible, reset } = useAI();

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleAnalyze() {
    if (!form.tema) { alert("Preencha o tema do ciclo."); return; }
    const etapasText = ETAPAS.map(e =>
      `${e.name}:\n${form[e.key as keyof typeof form] || "(não preenchido)"}`
    ).join("\n\n");
    analyze(
      `Você é um especialista em metodologia PDCA e melhoria contínua com experiência em gestão hoteleira e operações. Analise ciclos PDCA com rigor técnico, identificando lacunas no raciocínio e propondo próximos passos práticos. Responda sempre em português brasileiro.`,
      `Analise este Ciclo PDCA nº ${form.numero}:\n\nTEMA: ${form.tema}\n\nETAPAS:\n${etapasText}\n\nFaça:\n1. Avalie se cada etapa está bem estruturada e conectada às demais\n2. Identifique etapas incompletas ou superficiais\n3. Se o Check mostrar que a meta não foi atingida, avalie se o Act está adequado\n4. Se o ciclo estiver completo e bem-sucedido, oriente sobre como padronizar e expandir\n5. Recomende o foco do próximo ciclo`
    );
  }

  return (
    <div>
      <div style={toolHeader}>
        <div style={s.badge}>Ciclo de Melhoria Contínua</div>
        <h1 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 6, lineHeight: 1.1 }}>Ciclo PDCA</h1>
        <p style={s.desc}>Plan, Do, Check, Act. O ciclo clássico de gestão para resolver problemas e melhorar processos de forma estruturada e repetível.</p>
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Identificação do Ciclo</div>
        <label style={s.label}>Qual processo ou problema está sendo trabalhado neste ciclo?</label>
        <input style={s.input} type="text" value={form.tema} onChange={e => set("tema", e.target.value)}
          placeholder="Ex: Reduzir tempo médio de check-in para menos de 5 minutos" />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--navy)", color: "var(--gold-light, #e2c47a)",
          fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 20, marginTop: 14,
        }}>
          🔄 Ciclo nº
          <input
            type="text"
            value={form.numero}
            onChange={e => set("numero", e.target.value)}
            style={{
              background: "transparent", border: "none",
              borderBottom: "1px dashed rgba(226,196,122,0.5)",
              color: "var(--gold-light, #e2c47a)",
              fontFamily: "inherit", fontSize: 12, fontWeight: 600,
              width: 40, outline: "none",
            }}
          />
        </div>
      </div>

      <div style={card}>
        <div style={s.cardTitle}>As 4 Etapas</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {ETAPAS.map(etapa => (
            <div key={etapa.key} style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: etapa.color, flexShrink: 0,
                }}>
                  <span className="font-serif" style={{ fontSize: 18, color: "var(--white)" }}>{etapa.letter}</span>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--navy)" }}>{etapa.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>{etapa.sub}</div>
                </div>
              </div>
              <textarea
                style={{ ...s.textarea, minHeight: 80, background: "var(--white)" }}
                value={form[etapa.key as keyof typeof form]}
                onChange={e => set(etapa.key, e.target.value)}
                placeholder={etapa.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={s.actionsRow}>
        <button style={btnGold} onClick={handleAnalyze}>⟳ Analisar Ciclo com IA</button>
        <button style={btnOutline} onClick={() => { setForm(EMPTY); reset(); }}>Limpar</button>
      </div>

      <AIOutput visible={visible} loading={loading} result={result} />
    </div>
  );
}
