"use client";
import { useState } from "react";
import { useAI } from "@/app/hooks/useAI";
import { AIOutput } from "./AIOutput";
import { s, card, btnGold, btnOutline, toolHeader } from "./styles";

type Q = "q1" | "q2" | "q3" | "q4";

const QUADRANTS: { key: Q; title: string; action: string; titleColor: string; actionBg: string; actionColor: string }[] = [
  { key: "q1", title: "🔥 Urgente + Importante", action: "FAZER AGORA", titleColor: "#c0392b", actionBg: "#fde8e8", actionColor: "#c0392b" },
  { key: "q2", title: "📅 Não Urgente + Importante", action: "AGENDAR", titleColor: "#1a6b4a", actionBg: "#e0f5ec", actionColor: "#1a6b4a" },
  { key: "q3", title: "📞 Urgente + Não Importante", action: "DELEGAR", titleColor: "#7a5c1e", actionBg: "var(--gold-pale, #f5e9c8)", actionColor: "#7a5c1e" },
  { key: "q4", title: "🗑️ Não Urgente + Não Importante", action: "ELIMINAR", titleColor: "var(--text-muted)", actionBg: "#f0f0f0", actionColor: "var(--text-muted)" },
];

export function EisenhowerPanel() {
  const [tasks, setTasks] = useState<Record<Q, string[]>>({ q1: [], q2: [], q3: [], q4: [] });
  const [inputs, setInputs] = useState<Record<Q, string>>({ q1: "", q2: "", q3: "", q4: "" });
  const { analyze, loading, result, visible, reset } = useAI();

  function addTask(q: Q) {
    const text = inputs[q].trim();
    if (!text) return;
    setTasks(prev => ({ ...prev, [q]: [...prev[q], text] }));
    setInputs(prev => ({ ...prev, [q]: "" }));
  }

  function removeTask(q: Q, idx: number) {
    setTasks(prev => ({ ...prev, [q]: prev[q].filter((_, i) => i !== idx) }));
  }

  function handleAnalyze() {
    const total = Object.values(tasks).flat().length;
    if (total === 0) { alert("Adicione pelo menos uma tarefa na matriz."); return; }
    const text = QUADRANTS.map(q =>
      `${q.title} (${q.action}):\n${tasks[q.key].length > 0 ? tasks[q.key].map(t => "  - " + t).join("\n") : "  (vazio)"}`
    ).join("\n\n");
    analyze(
      `Você é um especialista em gestão do tempo, liderança e produtividade com experiência em gestão hoteleira. Analise matrizes de Eisenhower com foco em resultados práticos. Responda sempre em português brasileiro.`,
      `Analise esta Matriz de Eisenhower:\n\n${text}\n\nFaça:\n1. Avalie a distribuição das tarefas — está saudável? Há sintomas de urgência crônica?\n2. Questione se alguma tarefa está no quadrante errado\n3. Para Q1: dê dicas de execução imediata e como evitar que voltem\n4. Para Q2: sugira como proteger tempo para essas atividades estratégicas\n5. Para Q3: oriente sobre como delegar com efetividade\n6. Para Q4: valide as tarefas que realmente devem ser eliminadas\n7. Dê uma recomendação de foco para as próximas 48 horas`
    );
  }

  return (
    <div>
      <div style={toolHeader}>
        <div style={s.badge}>Gestão de Prioridades</div>
        <h1 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 6, lineHeight: 1.1 }}>Matriz de Eisenhower</h1>
        <p style={s.desc}>Priorize tarefas pelo grau de urgência e importância. Foque no que realmente move o negócio e elimine o que não gera valor.</p>
      </div>

      {/* Axis labels */}
      <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 1fr", textAlign: "center", marginBottom: 4 }}>
        <div />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", padding: "0 8px 6px" }}>🔴 Urgente</div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", padding: "0 8px 6px" }}>🟢 Não Urgente</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 3 }}>
        {/* Y-axis labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {["🔵 Imp.", "⚪ N. Imp."].map((label, i) => (
            <div key={i} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
              writingMode: "vertical-rl", transform: "rotate(180deg)",
              fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
              color: "var(--text-muted)", background: i === 0 ? "#fff5f5" : "#f0f0f0",
              borderRadius: i === 0 ? "8px 0 0 0" : "0 0 0 8px",
              border: i === 0 ? "1px solid #fde8e8" : "1px solid #e5e5e5",
              minHeight: 180,
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* Matrix */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3, background: "var(--navy)", borderRadius: 20, overflow: "hidden" }}>
          {QUADRANTS.map(q => (
            <div key={q.key} style={{ background: "var(--white)", padding: 22, minHeight: 180 }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", color: q.titleColor }}>{q.title}</div>
                <div style={{ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.8px", background: q.actionBg, color: q.actionColor, whiteSpace: "nowrap", marginLeft: 8 }}>{q.action}</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {tasks[q.key].map((task, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", fontSize: 13, color: "var(--text-main)" }}>
                    <span style={{ flex: 1 }}>{task}</span>
                    <button onClick={() => removeTask(q.key, idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 14, lineHeight: 1 }}>×</button>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <input
                  type="text"
                  style={{ ...s.input, flex: 1, minWidth: 0, padding: "7px 10px", fontSize: 13, background: "var(--cream)" }}
                  placeholder="Adicionar tarefa..."
                  value={inputs[q.key]}
                  onChange={e => setInputs(prev => ({ ...prev, [q.key]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && addTask(q.key)}
                />
                <button onClick={() => addTask(q.key)} style={{ background: "var(--navy)", color: "var(--white)", border: "none", borderRadius: 8, padding: "7px 12px", fontSize: 14, cursor: "pointer", fontWeight: 600 }}>+</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ ...s.actionsRow, marginTop: 16 }}>
        <button style={btnGold} onClick={handleAnalyze}>⟳ Analisar Prioridades com IA</button>
        <button style={btnOutline} onClick={() => { setTasks({ q1: [], q2: [], q3: [], q4: [] }); reset(); }}>Limpar matriz</button>
      </div>

      <AIOutput visible={visible} loading={loading} result={result} />
    </div>
  );
}
