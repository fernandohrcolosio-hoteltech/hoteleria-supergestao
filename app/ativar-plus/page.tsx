"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const TOOLS: Record<string, { icon: string; name: string }> = {
  ishikawa:   { icon: "🐟", name: "Diagrama de Ishikawa" },
  porques:    { icon: "❓", name: "5 Porquês" },
  smart:      { icon: "🎯", name: "Metas SMART" },
  eisenhower: { icon: "⚡", name: "Matriz de Eisenhower" },
  "5s":       { icon: "🧹", name: "Programa 5S" },
  pdca:       { icon: "🔄", name: "Ciclo PDCA" },
};

function ActivateInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toolSlug = searchParams.get("tool") || "";
  const tool = TOOLS[toolSlug];

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function activate() {
    if (!code.trim()) return;
    setStatus("loading");
    setMsg("");
    const resp = await fetch("/api/plus/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim(), tool_slug: toolSlug }),
    });
    const data = await resp.json();
    if (resp.ok) {
      setStatus("success");
      setMsg("Acesso Plus ativado com sucesso!");
      setTimeout(() => router.push(`/ferramenta/${toolSlug}`), 1800);
    } else {
      setStatus("error");
      setMsg(data.error || "Erro ao ativar. Tente novamente.");
    }
  }

  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ background: "var(--navy)", boxShadow: "0 2px 20px rgba(13,27,42,0.3)" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 32px",
          display: "flex", alignItems: "center", height: 62,
        }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36, background: "var(--gold)", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "serif", fontSize: 15, color: "var(--navy)", fontWeight: 700,
            }}>MC</div>
          </Link>
          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)", margin: "0 16px" }} />
          <div>
            <div style={{ fontFamily: "serif", fontSize: 16, color: "var(--white)", lineHeight: 1.1 }}>
              Ativação Plus
            </div>
            <div style={{ fontSize: 10, color: "var(--gold-light, #e2c47a)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              Desbloqueie o Plano de Ação
            </div>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 520, margin: "80px auto", padding: "0 24px" }}>
        <div style={{
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 8px 40px rgba(13,27,42,0.1)",
        }}>
          {/* Gold bar */}
          <div style={{ height: 4, background: "linear-gradient(90deg, var(--gold), #e2c47a, var(--gold))" }} />

          <div style={{ padding: "40px 40px 36px" }}>
            {/* Tool badge */}
            {tool ? (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "var(--cream)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "10px 18px", marginBottom: 28,
              }}>
                <span style={{ fontSize: 24 }}>{tool.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)" }}>{tool.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Versão Plus</div>
                </div>
              </div>
            ) : (
              <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 28 }}>
                Ferramenta não identificada. Volte ao link do produto.
              </div>
            )}

            <h1 style={{ fontFamily: "serif", fontSize: 26, color: "var(--navy)", margin: "0 0 10px" }}>
              Ative seu acesso Plus
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 32px" }}>
              Insira o código recebido após sua compra para desbloquear o <strong>Plano de Ação com IA</strong> nesta ferramenta.
            </p>

            {/* Code input */}
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--navy)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "1px" }}>
              Código de ativação
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && activate()}
              placeholder="XXXXX-XXXXX"
              disabled={status === "success"}
              style={{
                width: "100%", boxSizing: "border-box",
                background: "var(--cream)", border: "2px solid var(--border)",
                borderRadius: 10, padding: "14px 16px",
                fontSize: 18, fontFamily: "monospace", fontWeight: 600,
                letterSpacing: "3px", color: "var(--navy)",
                outline: "none", marginBottom: 16,
              }}
            />

            {/* Error / success message */}
            {msg && (
              <div style={{
                padding: "12px 16px", borderRadius: 10, marginBottom: 16, fontSize: 14,
                background: status === "success" ? "rgba(26,107,74,0.1)" : "rgba(192,57,43,0.08)",
                color: status === "success" ? "#1a6b4a" : "#c0392b",
                border: `1px solid ${status === "success" ? "rgba(26,107,74,0.2)" : "rgba(192,57,43,0.2)"}`,
              }}>
                {status === "success" ? "✓ " : "⚠ "}{msg}
                {status === "success" && (
                  <span style={{ fontSize: 12, opacity: 0.7, display: "block", marginTop: 4 }}>
                    Redirecionando para a ferramenta...
                  </span>
                )}
              </div>
            )}

            <button
              onClick={activate}
              disabled={status === "loading" || status === "success" || !code.trim() || !tool}
              style={{
                width: "100%", padding: "15px",
                background: status === "success" ? "#1a6b4a" : "var(--gold)",
                color: status === "success" ? "var(--white)" : "var(--navy)",
                border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", opacity: (status === "loading" || !code.trim() || !tool) ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Validando..." : status === "success" ? "✓ Ativado!" : "Ativar acesso Plus"}
            </button>

            <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", marginTop: 20 }}>
              Ainda não tem o Plus?{" "}
              <Link href="/" style={{ color: "var(--navy)", fontWeight: 600 }}>
                Conheça os planos →
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AtivarPlusPage() {
  return (
    <Suspense>
      <ActivateInner />
    </Suspense>
  );
}
