"use client";
import { useState } from "react";

const TOOLS = [
  { slug: "ishikawa",   icon: "🐟", name: "Ishikawa" },
  { slug: "porques",    icon: "❓", name: "5 Porquês" },
  { slug: "smart",      icon: "🎯", name: "SMART" },
  { slug: "eisenhower", icon: "⚡", name: "Eisenhower" },
  { slug: "5s",         icon: "🧹", name: "5S" },
  { slug: "pdca",       icon: "🔄", name: "PDCA" },
];

interface Code {
  code: string;
  tool_slug: string;
  used_by: string | null;
  activated_at: string | null;
  created_at: string;
}

export default function AdminPlusCodesPage() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authErr, setAuthErr] = useState("");

  const [selectedTool, setSelectedTool] = useState("ishikawa");
  const [count, setCount] = useState(10);
  const [codes, setCodes] = useState<Code[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function checkAuth() {
    setAuthErr("");
    const resp = await fetch("/api/admin/plus-codes?tool=ishikawa", {
      headers: { "x-admin-secret": secret },
    });
    if (resp.ok) {
      setAuthed(true);
      loadCodes("ishikawa");
    } else {
      setAuthErr("Senha incorreta.");
    }
  }

  async function loadCodes(tool: string) {
    setLoading(true);
    const resp = await fetch(`/api/admin/plus-codes?tool=${tool}`, {
      headers: { "x-admin-secret": secret },
    });
    const data = await resp.json();
    setCodes(data.codes || []);
    setLoading(false);
  }

  async function generateCodes() {
    setGenerating(true);
    setMsg("");
    const resp = await fetch("/api/admin/plus-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-secret": secret },
      body: JSON.stringify({ tool_slug: selectedTool, count }),
    });
    const data = await resp.json();
    if (resp.ok) {
      setMsg(`✓ ${data.codes.length} códigos gerados!`);
      loadCodes(selectedTool);
    } else {
      setMsg(`⚠ ${data.error}`);
    }
    setGenerating(false);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  function copyAllUnused() {
    const unused = codes.filter(c => !c.used_by).map(c => c.code).join("\n");
    navigator.clipboard.writeText(unused).then(() => {
      setMsg(`✓ ${codes.filter(c => !c.used_by).length} códigos copiados!`);
      setTimeout(() => setMsg(""), 2000);
    });
  }

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{
          background: "var(--white)", border: "1px solid var(--border)", borderRadius: 20,
          padding: "48px", width: 360, boxShadow: "0 8px 40px rgba(13,27,42,0.1)",
        }}>
          <div style={{ fontSize: 32, marginBottom: 16, textAlign: "center" }}>🔐</div>
          <h2 style={{ fontFamily: "serif", color: "var(--navy)", textAlign: "center", margin: "0 0 24px" }}>
            Admin · Plus Codes
          </h2>
          <input
            type="password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === "Enter" && checkAuth()}
            placeholder="ADMIN_SECRET"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "var(--cream)", border: "2px solid var(--border)",
              borderRadius: 10, padding: "12px 14px", fontSize: 14,
              fontFamily: "monospace", color: "var(--navy)", outline: "none", marginBottom: 12,
            }}
          />
          {authErr && <div style={{ color: "#c0392b", fontSize: 13, marginBottom: 10 }}>⚠ {authErr}</div>}
          <button
            onClick={checkAuth}
            style={{
              width: "100%", background: "var(--navy)", color: "var(--white)",
              border: "none", borderRadius: 10, padding: "12px",
              fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  const unusedCount = codes.filter(c => !c.used_by).length;
  const usedCount = codes.filter(c => c.used_by).length;

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <header style={{ background: "var(--navy)", padding: "0 32px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "serif", fontSize: 18, color: "var(--white)" }}>
          ⚙️ Admin · Plus Codes
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Área restrita</div>
      </header>

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Generate panel */}
        <div style={{
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 28, marginBottom: 28,
        }}>
          <h2 style={{ fontFamily: "serif", color: "var(--navy)", margin: "0 0 20px", fontSize: 20 }}>
            Gerar novos códigos
          </h2>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Ferramenta</div>
              <select
                value={selectedTool}
                onChange={e => { setSelectedTool(e.target.value); loadCodes(e.target.value); }}
                style={{
                  background: "var(--cream)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 14,
                  color: "var(--navy)", fontFamily: "inherit", cursor: "pointer",
                }}
              >
                {TOOLS.map(t => (
                  <option key={t.slug} value={t.slug}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>Quantidade</div>
              <input
                type="number"
                min={1} max={100}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                style={{
                  background: "var(--cream)", border: "1px solid var(--border)",
                  borderRadius: 8, padding: "10px 14px", fontSize: 14,
                  color: "var(--navy)", width: 90, fontFamily: "inherit",
                }}
              />
            </div>
            <button
              onClick={generateCodes}
              disabled={generating}
              style={{
                background: "var(--gold)", color: "var(--navy)",
                border: "none", borderRadius: 8, padding: "11px 22px",
                fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {generating ? "Gerando..." : "✦ Gerar códigos"}
            </button>
            {msg && (
              <span style={{ fontSize: 14, color: msg.startsWith("✓") ? "#1a6b4a" : "#c0392b" }}>
                {msg}
              </span>
            )}
          </div>
        </div>

        {/* Codes list */}
        <div style={{ background: "var(--white)", border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{
            padding: "18px 24px", background: "var(--navy)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ color: "var(--white)", fontFamily: "serif", fontSize: 16 }}>
                {TOOLS.find(t => t.slug === selectedTool)?.icon}{" "}
                {TOOLS.find(t => t.slug === selectedTool)?.name} Plus
              </div>
              <div style={{ fontSize: 11, color: "var(--gold-light, #e2c47a)", marginTop: 2 }}>
                {unusedCount} disponíveis · {usedCount} utilizados
              </div>
            </div>
            {unusedCount > 0 && (
              <button
                onClick={copyAllUnused}
                style={{
                  background: "rgba(201,168,76,0.2)", border: "1px solid rgba(201,168,76,0.4)",
                  borderRadius: 8, color: "var(--gold-light, #e2c47a)",
                  padding: "7px 14px", fontSize: 12, cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Copiar todos disponíveis
              </button>
            )}
          </div>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Carregando...</div>
          ) : codes.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
              Nenhum código gerado ainda. Use o painel acima.
            </div>
          ) : (
            <div style={{ padding: 16 }}>
              {/* URL de ativação */}
              <div style={{
                background: "var(--cream)", border: "1px solid var(--border)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 12,
              }}>
                <span style={{ color: "var(--text-muted)" }}>URL do produto Kiwify Plus → </span>
                <code style={{ color: "var(--navy)", fontWeight: 600 }}>
                  {`/ativar-plus?tool=${selectedTool}`}
                </code>
              </div>

              {codes.filter(c => !c.used_by).length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                    Disponíveis ({unusedCount})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {codes.filter(c => !c.used_by).map(c => (
                      <button
                        key={c.code}
                        onClick={() => copyCode(c.code)}
                        title="Clique para copiar"
                        style={{
                          background: copied === c.code ? "rgba(26,107,74,0.1)" : "var(--cream)",
                          border: `1px solid ${copied === c.code ? "rgba(26,107,74,0.3)" : "var(--border)"}`,
                          borderRadius: 8, padding: "8px 14px",
                          fontFamily: "monospace", fontSize: 14, fontWeight: 600,
                          color: copied === c.code ? "#1a6b4a" : "var(--navy)",
                          cursor: "pointer", letterSpacing: "1.5px",
                        }}
                      >
                        {copied === c.code ? "✓ Copiado" : c.code}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {codes.filter(c => c.used_by).length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>
                    Utilizados ({usedCount})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {codes.filter(c => c.used_by).map(c => (
                      <div
                        key={c.code}
                        style={{
                          background: "var(--cream)", border: "1px solid var(--border)",
                          borderRadius: 8, padding: "8px 14px", opacity: 0.5,
                          fontFamily: "monospace", fontSize: 13, color: "var(--text-muted)",
                          letterSpacing: "1.5px", textDecoration: "line-through",
                        }}
                      >
                        {c.code}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
