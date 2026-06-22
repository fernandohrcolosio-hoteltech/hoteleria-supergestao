"use client";
import { useState } from "react";
import Link from "next/link";

interface Props {
  icon: string;
  name: string;
  badge: string;
}

export function StandaloneHeader({ icon, name, badge }: Props) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <header style={{
      background: "var(--navy)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 20px rgba(13,27,42,0.3)",
    }}>
      <div style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 62,
      }}>

        {/* Logo + ferramenta */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--gold)", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-serif, serif)",
              fontSize: 15, color: "var(--navy)", fontWeight: 700,
              letterSpacing: "-0.5px",
            }}>MC</div>
          </Link>

          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.15)" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 22 }}>{icon}</span>
            <div>
              <div style={{
                fontFamily: "var(--font-serif, serif)",
                fontSize: 16, color: "var(--white)", lineHeight: 1.1,
              }}>
                {name}
              </div>
              <div style={{
                fontSize: 10, color: "var(--gold-light, #e2c47a)",
                textTransform: "uppercase", letterSpacing: "1.5px",
              }}>
                {badge}
              </div>
            </div>
          </div>
        </div>

        {/* Copiar link */}
        <button
          onClick={copyLink}
          style={{
            background: copied ? "rgba(26,107,74,0.25)" : "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 8,
            color: copied ? "#6ee7b7" : "rgba(255,255,255,0.7)",
            fontSize: 12, fontWeight: 500,
            padding: "7px 14px",
            cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            whiteSpace: "nowrap",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
        >
          {copied ? "✓ Copiado!" : "🔗 Copiar link"}
        </button>
      </div>
    </header>
  );
}
