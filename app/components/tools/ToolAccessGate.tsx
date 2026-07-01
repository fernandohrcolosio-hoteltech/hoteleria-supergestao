"use client";
import { useState, useEffect, ReactNode } from "react";

const KIWIFY_BASIC: Record<string, string> = {
  ishikawa:   "https://pay.kiwify.com.br/MqZDQPx",
  porques:    "https://pay.kiwify.com.br/r7fcL2N",
  smart:      "https://pay.kiwify.com.br/mm2pb8R",
  eisenhower: "https://pay.kiwify.com.br/U9oIJ6A",
  "5s":       "https://kiwify.app/nUQQTOB",
  pdca:       "https://kiwify.app/3Lgmtig",
};

const KIWIFY_PLUS: Record<string, string> = {
  ishikawa:   "https://pay.kiwify.com.br/m9u84cduwt0",
  porques:    "https://pay.kiwify.com.br/ds537bwe5o6",
  smart:      "https://pay.kiwify.com.br/olpea9bbp1a",
  eisenhower: "https://pay.kiwify.com.br/bttw0g9fn0b",
  "5s":       "https://pay.kiwify.com.br/1yy3v2acoib",
  pdca:       "https://pay.kiwify.com.br/ihgj7osb8is",
};

function hasAccessForSlug(slug: string): boolean {
  if (typeof document === "undefined") return false;
  const basicMatch = document.cookie.match(/(?:^|;\s*)basic_tools=([^;]*)/);
  const plusMatch  = document.cookie.match(/(?:^|;\s*)plus_tools=([^;]*)/);
  const basicSlugs = basicMatch ? basicMatch[1].split(",").filter(Boolean) : [];
  const plusSlugs  = plusMatch  ? plusMatch[1].split(",").filter(Boolean)  : [];
  return basicSlugs.includes(slug) || plusSlugs.includes(slug);
}

interface Props {
  toolSlug: string;
  toolName: string;
  toolIcon: string;
  children: ReactNode;
  onAccessGranted?: () => void;
}

export function ToolAccessGate({ toolSlug, toolName, toolIcon, children, onAccessGranted }: Props) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setHasAccess(hasAccessForSlug(toolSlug));
  }, [toolSlug]);

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
      setMsg("Acesso ativado! Carregando ferramenta...");
      setTimeout(() => {
        setHasAccess(true);
        onAccessGranted?.();
      }, 1000);
    } else {
      setStatus("error");
      setMsg(data.error || "Código inválido. Tente novamente.");
    }
  }

  // Loading
  if (hasAccess === null) return null;

  // Acesso liberado
  if (hasAccess) return <>{children}</>;

  // Sem acesso — tela de compra
  return (
    <div style={{
      minHeight: "100vh", background: "var(--cream)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{ maxWidth: 560, width: "100%" }}>

        {/* Cabeçalho */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>{toolIcon}</div>
          <h1 style={{
            fontFamily: "serif", fontSize: 28, color: "var(--navy)",
            margin: "0 0 12px",
          }}>
            {toolName}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            Esta ferramenta requer uma licença. Escolha o plano ou insira seu código de acesso abaixo.
          </p>
        </div>

        {/* Cards de planos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {/* Basic */}
          <a
            href={KIWIFY_BASIC[toolSlug] || "/#precos"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--white)", border: "2px solid var(--border)",
              borderRadius: 16, padding: "24px 20px", textDecoration: "none",
              display: "block", transition: "border-color 0.2s",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>
              BASIC
            </div>
            <div style={{ fontFamily: "serif", fontSize: 22, color: "var(--navy)", marginBottom: 4 }}>
              R$ 19,90
            </div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
              Ferramenta + IA. Uso pontual e diagnósticos rápidos.
            </div>
            <div style={{
              background: "var(--navy)", color: "var(--white)",
              borderRadius: 8, padding: "9px 0", textAlign: "center",
              fontSize: 13, fontWeight: 700,
            }}>
              Comprar Basic →
            </div>
          </a>

          {/* Plus */}
          <a
            href={KIWIFY_PLUS[toolSlug] || "/#precos"}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "var(--navy)", border: "2px solid var(--gold)",
              borderRadius: 16, padding: "24px 20px", textDecoration: "none",
              display: "block", position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 3,
              background: "linear-gradient(90deg, var(--gold), #e2c47a, var(--gold))",
            }} />
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--gold-light, #e2c47a)", marginBottom: 8 }}>
              ✦ PLUS — RECOMENDADO
            </div>
            <div style={{ fontFamily: "serif", fontSize: 22, color: "var(--white)", marginBottom: 4 }}>
              R$ 59,90
            </div>
            <div style={{ fontSize: 12, color: "rgba(250,248,243,0.6)", marginBottom: 16, lineHeight: 1.5 }}>
              Tudo do Basic + plano de ação salvo com IA e histórico.
            </div>
            <div style={{
              background: "var(--gold)", color: "var(--navy)",
              borderRadius: 8, padding: "9px 0", textAlign: "center",
              fontSize: 13, fontWeight: 700,
            }}>
              Comprar Plus →
            </div>
          </a>
        </div>

        {/* Inserir código */}
        <div style={{
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 16, padding: 24,
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--navy)", marginBottom: 12 }}>
            Já comprei — inserir código de acesso
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && activate()}
              placeholder="Seu código (ex: FHC-B-ISHI-01)"
              disabled={status === "success"}
              autoFocus
              style={{
                flex: 1, background: "var(--cream)",
                border: "1.5px solid var(--border)", borderRadius: 10,
                padding: "12px 14px", fontSize: 14,
                fontFamily: "monospace", fontWeight: 600, letterSpacing: "1px",
                color: "var(--navy)", outline: "none",
              }}
            />
            <button
              onClick={activate}
              disabled={status === "loading" || status === "success" || !code.trim()}
              style={{
                background: status === "success" ? "#1a6b4a" : "var(--gold)",
                color: status === "success" ? "var(--white)" : "var(--navy)",
                border: "none", borderRadius: 10, padding: "12px 20px",
                fontSize: 14, fontWeight: 700, cursor: "pointer",
                whiteSpace: "nowrap",
                opacity: (status === "loading" || !code.trim()) ? 0.7 : 1,
              }}
            >
              {status === "loading" ? "Validando..." : status === "success" ? "✓ Ativado!" : "Ativar"}
            </button>
          </div>
          {msg && (
            <div style={{
              marginTop: 10, fontSize: 13, padding: "8px 12px", borderRadius: 8,
              background: status === "success" ? "rgba(26,107,74,0.1)" : "rgba(192,57,43,0.1)",
              color: status === "success" ? "#1a6b4a" : "#c0392b",
            }}>
              {status === "success" ? "✓ " : "⚠ "}{msg}
            </div>
          )}
        </div>

        {/* Voltar */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <a href="/" style={{ color: "var(--text-muted)", fontSize: 13, textDecoration: "underline" }}>
            ← Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  );
}
