"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface Action {
  id: string;
  text: string;
  source: "ai" | "user";
  done: boolean;
  createdAt: string;
}

const TOOLS: Record<string, { icon: string; name: string; slug: string }> = {
  ishikawa:   { icon: "🐟", name: "Diagrama de Ishikawa", slug: "ishikawa" },
  porques:    { icon: "❓", name: "5 Porquês",            slug: "porques" },
  smart:      { icon: "🎯", name: "Metas SMART",          slug: "smart" },
  eisenhower: { icon: "⚡", name: "Matriz de Eisenhower", slug: "eisenhower" },
  "5s":       { icon: "🧹", name: "Programa 5S",          slug: "5s" },
  pdca:       { icon: "🔄", name: "Ciclo PDCA",           slug: "pdca" },
};

export default function MinhasAcoesPage() {
  const [allActions, setAllActions] = useState<Record<string, Action[]>>({});
  const [sessionId, setSessionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [restoreCode, setRestoreCode] = useState("");
  const [restoreMsg, setRestoreMsg] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    fetch("/api/tool-actions/all")
      .then(r => r.json())
      .then(d => {
        setAllActions(d.actions || {});
        setSessionId(d.sessionId || "");
        setLoading(false);
      });
  }, []);

  function toggleDone(slug: string, id: string) {
    const updated = allActions[slug].map(a => a.id === id ? { ...a, done: !a.done } : a);
    const next = { ...allActions, [slug]: updated };
    setAllActions(next);
    fetch("/api/tool-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, actions: updated }),
    });
  }

  function removeAction(slug: string, id: string) {
    const updated = allActions[slug].filter(a => a.id !== id);
    const next = { ...allActions, [slug]: updated };
    setAllActions(next);
    fetch("/api/tool-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, actions: updated }),
    });
  }

  async function handleRestore() {
    setRestoring(true);
    setRestoreMsg("");
    const resp = await fetch("/api/session/restore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: restoreCode }),
    });
    const data = await resp.json();
    if (resp.ok) {
      setRestoreMsg("✓ Acesso restaurado! Recarregando...");
      setTimeout(() => window.location.reload(), 1500);
    } else {
      setRestoreMsg(`⚠ ${data.error}`);
    }
    setRestoring(false);
  }

  function copyCode() {
    navigator.clipboard.writeText(sessionId).then(() => {
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    });
  }

  const totalActions = Object.values(allActions).flat().length;
  const doneActions = Object.values(allActions).flat().filter(a => a.done).length;
  const toolsWithActions = Object.entries(allActions).filter(([, actions]) => actions.length > 0);

  const shortCode = sessionId ? sessionId.slice(0, 8).toUpperCase() : "";

  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>

      {/* Header */}
      <header style={{
        background: "var(--navy)", position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(13,27,42,0.3)",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 62,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <div style={{
                width: 36, height: 36, background: "var(--gold)", borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "serif", fontSize: 15, color: "var(--navy)", fontWeight: 700,
              }}>MC</div>
            </Link>
            <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />
            <div>
              <div style={{ fontFamily: "serif", fontSize: 16, color: "var(--white)", lineHeight: 1.1 }}>
                Minhas Ações
              </div>
              <div style={{ fontSize: 10, color: "var(--gold-light, #e2c47a)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                Progresso em todas as ferramentas
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setShowCode(v => !v)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8, color: "rgba(255,255,255,0.75)", fontSize: 12,
                padding: "7px 14px", cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🔑 Meu código de acesso
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Código de acesso panel */}
        {showCode && (
          <div style={{
            background: "var(--navy)", borderRadius: 16, padding: 28, marginBottom: 28,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, var(--gold), #e2c47a, var(--gold))",
            }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold-light, #e2c47a)", marginBottom: 12 }}>
              ✦ Código de acesso pessoal
            </div>
            <p style={{ color: "rgba(250,248,243,0.75)", fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>
              Salve este código para acessar suas ações em outro navegador ou dispositivo.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{
                background: "rgba(255,255,255,0.07)", border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 10, padding: "12px 20px", fontFamily: "monospace",
                fontSize: 18, color: "var(--gold-light, #e2c47a)", letterSpacing: "3px", fontWeight: 700,
              }}>
                {shortCode}
              </div>
              <button onClick={copyCode} style={{
                background: codeCopied ? "rgba(26,107,74,0.3)" : "var(--gold)",
                color: codeCopied ? "#6ee7b7" : "var(--navy)",
                border: "none", borderRadius: 8, padding: "10px 18px",
                fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>
                {codeCopied ? "✓ Copiado!" : "Copiar código"}
              </button>
            </div>

            <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                Restaurar acesso com código salvo anteriormente:
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  type="text"
                  value={restoreCode}
                  onChange={e => setRestoreCode(e.target.value)}
                  placeholder="Cole seu código aqui..."
                  style={{
                    flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 8, padding: "10px 14px", color: "var(--white)",
                    fontFamily: "inherit", fontSize: 14, outline: "none",
                  }}
                />
                <button
                  onClick={handleRestore}
                  disabled={restoring || !restoreCode.trim()}
                  style={{
                    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: 8, color: "var(--white)", padding: "10px 18px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                    opacity: restoring ? 0.6 : 1,
                  }}
                >
                  {restoring ? "Restaurando..." : "Restaurar"}
                </button>
              </div>
              {restoreMsg && (
                <div style={{ marginTop: 10, fontSize: 13, color: restoreMsg.startsWith("✓") ? "#6ee7b7" : "#fca5a5" }}>
                  {restoreMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumo */}
        {!loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Total de ações", value: totalActions, color: "var(--navy)" },
              { label: "Concluídas", value: doneActions, color: "#1a6b4a" },
              { label: "Pendentes", value: totalActions - doneActions, color: "#c0392b" },
            ].map(stat => (
              <div key={stat.label} style={{
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "20px 24px",
                boxShadow: "0 2px 12px rgba(13,27,42,0.05)",
              }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: stat.color, fontFamily: "serif", lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Por ferramenta */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>Carregando...</div>
        ) : toolsWithActions.length === 0 ? (
          <div style={{
            background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16,
            padding: "48px 32px", textAlign: "center",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 18, fontFamily: "serif", color: "var(--navy)", marginBottom: 8 }}>
              Nenhuma ação salva ainda
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>
              Acesse uma ferramenta, preencha o problema e use o <strong>Plano de Ação</strong> para gerar ou adicionar ações.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {Object.values(TOOLS).map(t => (
                <Link key={t.slug} href={`/ferramenta/${t.slug}`} style={{
                  background: "var(--cream)", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "8px 16px", textDecoration: "none", color: "var(--navy)", fontSize: 13,
                }}>
                  {t.icon} {t.name}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {toolsWithActions.map(([slug, actions]) => {
              const tool = TOOLS[slug];
              const pending = actions.filter(a => !a.done);
              const done = actions.filter(a => a.done);
              return (
                <div key={slug} style={{
                  background: "var(--white)", border: "1px solid var(--border)",
                  borderRadius: 16, overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(13,27,42,0.05)",
                }}>
                  {/* Tool header */}
                  <div style={{
                    background: "var(--navy)", padding: "16px 24px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 22 }}>{tool.icon}</span>
                      <div>
                        <div style={{ fontFamily: "serif", fontSize: 16, color: "var(--white)" }}>
                          {tool.name}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--gold-light, #e2c47a)" }}>
                          {pending.length} pendente{pending.length !== 1 ? "s" : ""} · {done.length} concluída{done.length !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <Link href={`/ferramenta/${tool.slug}`} style={{
                      fontSize: 12, color: "var(--gold-light, #e2c47a)", textDecoration: "none",
                      background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)",
                      borderRadius: 6, padding: "5px 12px",
                    }}>
                      Abrir ferramenta →
                    </Link>
                  </div>

                  {/* Actions */}
                  <div style={{ padding: "16px 24px" }}>
                    {pending.map(action => (
                      <ActionRow key={action.id} action={action}
                        onToggle={() => toggleDone(slug, action.id)}
                        onRemove={() => removeAction(slug, action.id)} />
                    ))}
                    {done.length > 0 && pending.length > 0 && (
                      <div style={{ borderTop: "1px solid var(--border)", margin: "12px 0 10px", paddingTop: 10 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                          Concluídas
                        </div>
                      </div>
                    )}
                    {done.map(action => (
                      <ActionRow key={action.id} action={action}
                        onToggle={() => toggleDone(slug, action.id)}
                        onRemove={() => removeAction(slug, action.id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function ActionRow({ action, onToggle, onRemove }: {
  action: Action;
  onToggle: () => void;
  onRemove: () => void;
}) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "9px 12px", marginBottom: 6,
      background: action.done ? "var(--cream)" : "var(--white)",
      border: "1px solid var(--border)", borderRadius: 10,
      opacity: action.done ? 0.6 : 1,
    }}>
      <button onClick={onToggle} style={{
        width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
        border: action.done ? "2px solid #1a6b4a" : "2px solid var(--border)",
        background: action.done ? "#1a6b4a" : "var(--white)",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--white)", fontSize: 11, fontWeight: 700,
      }}>
        {action.done && "✓"}
      </button>
      <span style={{
        flex: 1, fontSize: 14, color: "var(--text-main)", lineHeight: 1.5,
        textDecoration: action.done ? "line-through" : "none",
      }}>
        {action.text}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 600, letterSpacing: "0.8px", textTransform: "uppercase",
        padding: "2px 8px", borderRadius: 20, flexShrink: 0,
        background: action.source === "ai" ? "var(--gold-pale, #f5e9c8)" : "#e8f0fe",
        color: action.source === "ai" ? "#7a5c1e" : "#1a3a7a",
      }}>
        {action.source === "ai" ? "IA" : "Você"}
      </span>
      <button onClick={onRemove} style={{
        background: "none", border: "none", cursor: "pointer",
        color: "var(--text-muted)", fontSize: 16, padding: 0, flexShrink: 0,
      }}>×</button>
    </div>
  );
}
