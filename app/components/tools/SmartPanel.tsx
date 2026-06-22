"use client";
import { useState } from "react";
import { useAI } from "@/app/hooks/useAI";
import { AIOutput } from "./AIOutput";
import { s, card, btnGold, btnOutline, toolHeader } from "./styles";

const EMPTY = { rascunho: "", S: "", M: "", A: "", R: "", T: "" };

const ITEMS = [
  { key: "S", letter: "S", label: "Específica", placeholder: "O que exatamente deve ser alcançado? Quem, o quê, onde, quando, por quê?" },
  { key: "M", letter: "M", label: "Mensurável", placeholder: "Como vou medir o progresso? Qual é o indicador numérico?" },
  { key: "A", letter: "A", label: "Atingível", placeholder: "A meta é realista? Temos recursos e capacidade?" },
  { key: "R", letter: "R", label: "Relevante", placeholder: "Por que essa meta importa? Como se alinha aos objetivos estratégicos?" },
  { key: "T", letter: "T", label: "Temporal", placeholder: "Qual é o prazo? Há marcos intermediários?", full: true },
];

export function SmartPanel() {
  const [form, setForm] = useState(EMPTY);
  const { analyze, loading, result, visible, reset } = useAI();

  function set(key: string, value: string) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function handleAnalyze() {
    if (!form.rascunho && !Object.entries(form).some(([k, v]) => k !== "rascunho" && v.trim())) {
      alert("Preencha pelo menos a meta em rascunho."); return;
    }
    const camposText = ITEMS
      .filter(i => form[i.key as keyof typeof form].trim())
      .map(i => `${i.label} (${i.key}): ${form[i.key as keyof typeof form]}`)
      .join("\n");
    analyze(
      `Você é um especialista em gestão de metas e planejamento estratégico com experiência em operações hoteleiras. Valide e aprimore metas SMART com rigor e praticidade. Responda sempre em português brasileiro.`,
      `Avalie e aprimore esta meta SMART:\n\nRASCUNHO: ${form.rascunho || "-"}\n\nCRITÉRIOS PREENCHIDOS:\n${camposText || "Nenhum critério preenchido"}\n\nFaça:\n1. Avalie cada critério SMART (S/M/A/R/T) com nota e comentário\n2. Reescreva a meta de forma completa e SMART\n3. Sugira KPIs para monitoramento\n4. Identifique riscos de não atingimento\n5. Proponha marcos (milestones) intermediários`
    );
  }

  return (
    <div>
      <div style={toolHeader}>
        <div style={s.badge}>Definição de Metas</div>
        <h1 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 6, lineHeight: 1.1 }}>Metas SMART</h1>
        <p style={s.desc}>Estruture metas que sejam Específicas, Mensuráveis, Atingíveis, Relevantes e com Prazo definido para garantir clareza e execução.</p>
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Meta em Rascunho</div>
        <label style={s.label}>Descreva sua meta de forma livre</label>
        <textarea style={s.textarea} value={form.rascunho} onChange={e => set("rascunho", e.target.value)}
          placeholder="Ex: Quero melhorar a nota de NPS do hotel..." />
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Critérios SMART</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {ITEMS.map(item => (
            <div
              key={item.key}
              style={{
                background: "var(--cream)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 18,
                gridColumn: item.full ? "1 / -1" : undefined,
              }}
            >
              <div className="font-serif" style={{ fontSize: 36, color: "var(--navy)", lineHeight: 1, marginBottom: 2 }}>{item.letter}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gold)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>{item.label}</div>
              <textarea
                style={{ ...s.textarea, minHeight: 60, background: "var(--white)" }}
                value={form[item.key as keyof typeof form]}
                onChange={e => set(item.key, e.target.value)}
                placeholder={item.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={s.actionsRow}>
        <button style={btnGold} onClick={handleAnalyze}>⟳ Validar e Aprimorar com IA</button>
        <button style={btnOutline} onClick={() => { setForm(EMPTY); reset(); }}>Limpar</button>
      </div>

      <AIOutput visible={visible} loading={loading} result={result} />
    </div>
  );
}
