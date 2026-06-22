"use client";
import { useState, useEffect, useRef } from "react";

export interface Action {
  id: string;
  text: string;
  source: "ai" | "user";
  done: boolean;
  createdAt: string;
}

interface Props {
  toolSlug: string;
  getContext: () => string;
}

export function ActionPlan({ toolSlug, getContext }: Props) {
  const [actions, setActions] = useState<Action[]>([]);
  const [newText, setNewText] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    fetch(`/api/tool-actions?slug=${toolSlug}`)
      .then(r => r.json())
      .then(d => { setActions(d.actions || []); setLoaded(true); });
  }, [toolSlug]);

  useEffect(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      fetch("/api/tool-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: toolSlug, actions }),
      }).then(() => setSaveStatus("saved"));
    }, 900);
  }, [actions, toolSlug, loaded]);

  async function suggestWithAI() {
    const context = getContext();
    if (!context.trim()) { alert("Preencha a ferramenta antes de sugerir ações."); return; }
    setLoadingAI(true);
    try {
      const resp = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: "Você é um especialista em melhoria contínua e gestão hoteleira. Sugira ações práticas e concretas. Cada ação em uma linha separada. Você pode usar '1.', '- ', '• ' ou qualquer marcador no início da linha. Sem blocos de texto, sem parágrafos longos. Responda em português brasileiro.",
          userPrompt: `Com base nas informações abaixo, sugira de 5 a 7 ações práticas, específicas e executáveis que a equipe pode fazer:\n\n${context}`,
        }),
      });
      const data = await resp.json();

      if (!resp.ok || data.error) {
        alert(`Erro da IA: ${data.error || "Tente novamente."}`);
        return;
      }

      const text: string = data.text || "";
      // Aceita linhas que começam com: número+ponto, número+), -, •, *, ou texto normal (≥ 10 chars)
      const lines = text
        .split("\n")
        .map((l: string) => l.trim())
        .filter((l: string) => l.length > 8)
        .filter((l: string) => /^(\d+[.)]\s|[-•*]\s|[A-ZÁÉÍÓÚ])/.test(l));
      const newActions: Action[] = lines.map((line: string) => ({
        id: crypto.randomUUID(),
        text: line.replace(/^(\d+[.)]\s*|[-•*]\s*)/, "").trim(),
        source: "ai",
        done: false,
        createdAt: new Date().toISOString(),
      }));
      if (newActions.length === 0) {
        // fallback: divide o texto em sentenças
        const sentences = text.split(/[.\n]/).map((s: string) => s.trim()).filter((s: string) => s.length > 15);
        if (sentences.length > 0) {
          setActions(prev => [...prev, ...sentences.slice(0, 7).map((s: string) => ({
            id: crypto.randomUUID(), text: s, source: "ai" as const, done: false,
            createdAt: new Date().toISOString(),
          }))]);
          return;
        }
        alert("A IA retornou um formato inesperado. Adicione ações manualmente.");
        return;
      }
      setActions(prev => [...prev, ...newActions]);
    } finally {
      setLoadingAI(false);
    }
  }

  function addManual() {
    const text = newText.trim();
    if (!text) return;
    setActions(prev => [...prev, {
      id: crypto.randomUUID(), text, source: "user", done: false,
      createdAt: new Date().toISOString(),
    }]);
    setNewText("");
  }

  function toggleDone(id: string) {
    setActions(prev => prev.map(a => a.id === id ? { ...a, done: !a.done } : a));
  }

  function remove(id: string) {
    setActions(prev => prev.filter(a => a.id !== id));
  }

  const pending = actions.filter(a => !a.done);
  const done = actions.filter(a => a.done);

  return (
    <div style={{
      background: "var(--white)", border: "1px solid var(--border)", borderRadius: 20,
      padding: 28, marginTop: 20, boxShadow: "0 4px 24px rgba(13,27,42,0.06)",
    }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, background: "var(--navy)", borderRadius: 9,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
          }}>✓</div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)" }}>Plano de Ação</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {pending.length} pendente{pending.length !== 1 ? "s" : ""} · {done.length} concluída{done.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {saveStatus === "saving" && (
            <span style={{ fontSize: 11, color: "var(--text-muted)" }}>salvando…</span>
          )}
          {saveStatus === "saved" && (
            <span style={{ fontSize: 11, color: "#1a6b4a" }}>✓ salvo</span>
          )}
          <button
            onClick={suggestWithAI}
            disabled={loadingAI}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: loadingAI ? "var(--border)" : "var(--gold)",
              color: loadingAI ? "var(--text-muted)" : "var(--navy)",
              border: "none", borderRadius: 9, padding: "8px 16px",
              fontSize: 13, fontWeight: 700, cursor: loadingAI ? "not-allowed" : "pointer",
            }}
          >
            {loadingAI
              ? <><span style={{ display: "inline-block", width: 12, height: 12, border: "2px solid var(--text-muted)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin .7s linear infinite" }} /> Gerando…</>
              : "✦ Sugerir ações com IA"
            }
          </button>
        </div>
      </div>

      {/* Pending actions */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          {pending.map(action => (
            <ActionItem key={action.id} action={action} onToggle={toggleDone} onRemove={remove} />
          ))}
        </div>
      )}

      {/* Done actions */}
      {done.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 10 }}>
            Concluídas
          </div>
          {done.map(action => (
            <ActionItem key={action.id} action={action} onToggle={toggleDone} onRemove={remove} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {actions.length === 0 && (
        <div style={{ textAlign: "center", padding: "28px 0 20px", color: "var(--text-muted)", fontSize: 14 }}>
          Clique em <strong style={{ color: "var(--navy)" }}>Sugerir ações com IA</strong> ou adicione manualmente abaixo.
        </div>
      )}

      {/* Add manual action */}
      <div style={{
        display: "flex", gap: 10, paddingTop: 16,
        borderTop: "1px solid var(--border)",
      }}>
        <input
          type="text"
          value={newText}
          onChange={e => setNewText(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addManual()}
          placeholder="Adicionar sua própria ação..."
          style={{
            flex: 1, background: "var(--cream)", border: "1px solid var(--border)",
            borderRadius: 8, padding: "10px 14px", fontSize: 14,
            color: "var(--text-main)", outline: "none",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={addManual}
          style={{
            background: "var(--navy)", color: "var(--white)", border: "none",
            borderRadius: 8, padding: "10px 18px", fontSize: 14, fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Adicionar
        </button>
      </div>
    </div>
  );
}

function ActionItem({ action, onToggle, onRemove }: {
  action: Action;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 14px", marginBottom: 6,
      background: action.done ? "var(--cream)" : "var(--white)",
      border: `1px solid ${action.done ? "var(--border)" : "var(--border)"}`,
      borderRadius: 10,
      opacity: action.done ? 0.65 : 1,
      transition: "opacity 0.2s",
    }}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(action.id)}
        style={{
          width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
          border: action.done ? "2px solid #1a6b4a" : "2px solid var(--border)",
          background: action.done ? "#1a6b4a" : "var(--white)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--white)", fontSize: 11, fontWeight: 700,
        }}
      >
        {action.done && "✓"}
      </button>

      {/* Text */}
      <span style={{
        flex: 1, fontSize: 14, color: "var(--text-main)", lineHeight: 1.5,
        textDecoration: action.done ? "line-through" : "none",
      }}>
        {action.text}
      </span>

      {/* Source badge */}
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase",
        padding: "2px 8px", borderRadius: 20, flexShrink: 0,
        background: action.source === "ai" ? "var(--gold-pale, #f5e9c8)" : "#e8f0fe",
        color: action.source === "ai" ? "#7a5c1e" : "#1a3a7a",
      }}>
        {action.source === "ai" ? "IA" : "Você"}
      </span>

      {/* Remove */}
      <button
        onClick={() => onRemove(action.id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-muted)", fontSize: 16, lineHeight: 1,
          padding: 0, flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
