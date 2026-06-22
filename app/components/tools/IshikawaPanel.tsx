"use client";
import { useState } from "react";
import { useAI } from "@/app/hooks/useAI";
import { AIOutput } from "./AIOutput";
import { s, card, btnGold, btnOutline, toolHeader } from "./styles";

const CAUSES = [
  { key: "mao", label: "Mão de Obra", color: "#c0392b", placeholder: "Falta de treinamento\nAlta rotatividade\nDesmotivação..." },
  { key: "maquina", label: "Máquina / Equipamento", color: "#1a6b4a", placeholder: "Equipamentos antigos\nFalta de manutenção..." },
  { key: "material", label: "Material", color: "#1a5276", placeholder: "Produtos de baixa qualidade\nEstoque inadequado..." },
  { key: "metodo", label: "Método", color: "#7a5c1e", placeholder: "Processo mal definido\nFalta de checklist..." },
  { key: "meio", label: "Meio Ambiente", color: "#6c3483", placeholder: "Layout inadequado\nTemperatura\nRuído..." },
  { key: "medicao", label: "Medição", color: "#117a65", placeholder: "Falta de indicadores\nInspeção falha..." },
];

const EMPTY = { mao: "", maquina: "", material: "", metodo: "", meio: "", medicao: "" };

export function IshikawaPanel() {
  const [problema, setProblema] = useState("");
  const [causas, setCausas] = useState(EMPTY);
  const { analyze, loading, result, visible, reset } = useAI();

  function handleAnalyze() {
    if (!problema) { alert("Preencha o problema central."); return; }
    const causasText = CAUSES
      .filter(c => causas[c.key as keyof typeof causas].trim())
      .map(c => `- ${c.label}: ${causas[c.key as keyof typeof causas]}`)
      .join("\n");
    analyze(
      `Você é um especialista em melhoria contínua e qualidade com experiência em operações hoteleiras. Analise diagramas de Ishikawa de forma objetiva, prática e orientada a ação. Responda sempre em português brasileiro.`,
      `Analise este Diagrama de Ishikawa:\n\nPROBLEMA: ${problema}\n\nCAUSAS IDENTIFICADAS:\n${causasText || "Nenhuma causa informada"}\n\nFaça:\n1. Avalie a qualidade da análise de causas\n2. Identifique as causas mais críticas (priorize 2-3)\n3. Sugira causas que possam ter sido esquecidas\n4. Proponha ações corretivas práticas para as causas principais\n5. Indique métricas para monitorar a resolução`
    );
  }

  return (
    <div>
      <div style={toolHeader}>
        <div style={s.badge}>Diagrama de Causa e Efeito</div>
        <h1 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 6, lineHeight: 1.1 }}>Diagrama de Ishikawa</h1>
        <p style={s.desc}>Identifique as causas raiz de um problema mapeando os fatores por categoria. Também chamado de Diagrama Espinha de Peixe.</p>
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Problema Central</div>
        <label style={s.label}>Qual é o efeito ou problema que você quer analisar?</label>
        <textarea style={s.textarea} value={problema} onChange={e => setProblema(e.target.value)}
          placeholder="Ex: Alta taxa de reclamações de hóspedes sobre limpeza de apartamentos..." />
      </div>

      <div style={card}>
        <div style={s.cardTitle}>Causas por Categoria (6M)</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          {CAUSES.map(c => (
            <div key={c.key} style={{ background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--navy)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                {c.label}
              </div>
              <textarea
                style={{ ...s.textarea, minHeight: 60, background: "var(--white)" }}
                value={causas[c.key as keyof typeof causas]}
                onChange={e => setCausas(prev => ({ ...prev, [c.key]: e.target.value }))}
                placeholder={c.placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={s.actionsRow}>
        <button style={btnGold} onClick={handleAnalyze}>⟳ Analisar com IA</button>
        <button style={btnOutline} onClick={() => { setProblema(""); setCausas(EMPTY); reset(); }}>Limpar</button>
      </div>

      <AIOutput visible={visible} loading={loading} result={result} />
    </div>
  );
}
