"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const TOOLS: Record<string, { icon: string; name: string; kiwify: string; price: string }> = {
  ishikawa:   { icon: "🐟", name: "Diagrama de Ishikawa", kiwify: "https://pay.kiwify.com.br/m9u84cduwt0", price: "R$ 59,90" },
  porques:    { icon: "❓", name: "5 Porquês",            kiwify: "https://pay.kiwify.com.br/ds537bwe5o6", price: "R$ 59,90" },
  smart:      { icon: "🎯", name: "Metas SMART",          kiwify: "https://pay.kiwify.com.br/olpea9bbp1a", price: "R$ 59,90" },
  eisenhower: { icon: "⚡", name: "Matriz de Eisenhower", kiwify: "https://pay.kiwify.com.br/bttw0g9fn0b", price: "R$ 59,90" },
  "5s":       { icon: "🧹", name: "Programa 5S",          kiwify: "https://pay.kiwify.com.br/1yy3v2acoib", price: "R$ 59,90" },
  pdca:       { icon: "🔄", name: "Ciclo PDCA",           kiwify: "https://pay.kiwify.com.br/ihgj7osb8is", price: "R$ 59,90" },
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

      <main style={{ maxWidth: 520, margin: "60px auto", padding: "0 24px 80px" }}>

        {/* ── Comprar agora ── */}
        {tool && (
          <div style={{
            background: "var(--navy)", borderRadius: 20, overflow: "hidden",
            boxShadow: "0 8px 40px rgba(13,27,42,0.2)", marginBottom: 16,
          }}>
            <div style={{ height: 4, background: "linear-gradient(90deg, var(--gold), #e2c47a, var(--gold))" }} />
            <div style={{ padding: "32px 36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 28 }}>{tool.icon}</span>
                <div>
                  <div style={{ fontFamily: "serif", fontSize: 18, color: "var(--white)" }}>{tool.name}</div>
                  <div style={{ fontSize: 11, color: "var(--gold-light, #e2c47a)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                    Versão Plus
                  </div>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <div style={{ fontFamily: "serif", fontSize: 26, color: "var(--gold-light, #e2c47a)", fontWeight: 700 }}>
                    {tool.price}
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>pagamento único</div>
                </div>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {["Formulário guiado com IA", "Análise inteligente do problema", "Plano de Ação salvo com IA", "Acesso em qualquer dispositivo", "Acesso vitalício"].map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ color: "var(--gold-light, #e2c47a)", fontSize: 13 }}>✓</span>
                    <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href={tool.kiwify}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "block", width: "100%", boxSizing: "border-box",
                  background: "var(--gold)", color: "var(--navy)",
                  borderRadius: 12, padding: "16px",
                  fontSize: 16, fontWeight: 700, textDecoration: "none",
                  textAlign: "center", letterSpacing: "0.3px",
                }}
              >
                Comprar agora — {tool.price}
              </a>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", textAlign: "center", margin: "12px 0 0" }}>
                Cartão, Pix ou boleto · Processado pelo Kiwify
              </p>
            </div>
          </div>
        )}

        {/* ── Já comprei — inserir código ── */}
        <div style={{
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 20, overflow: "hidden",
          boxShadow: "0 4px 20px rgba(13,27,42,0.07)",
        }}>
          <div style={{ padding: "28px 36px 32px" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: 16 }}>
              Já comprei — inserir código
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>
              Após a compra você recebe um código por e-mail. Insira abaixo para ativar o Plus nesta ferramenta.
            </p>

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
                outline: "none", marginBottom: 14,
              }}
            />

            {msg && (
              <div style={{
                padding: "12px 16px", borderRadius: 10, marginBottom: 14, fontSize: 14,
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
                width: "100%", padding: "14px",
                background: status === "success" ? "#1a6b4a" : "var(--navy)",
                color: "var(--white)",
                border: "none", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", opacity: (status === "loading" || !code.trim() || !tool) ? 0.6 : 1,
              }}
            >
              {status === "loading" ? "Validando..." : status === "success" ? "✓ Ativado!" : "Ativar acesso Plus"}
            </button>
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
