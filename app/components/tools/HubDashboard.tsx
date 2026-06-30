"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { IshikawaPanel } from "./IshikawaPanel";
import { PorquesPanel } from "./PorquesPanel";
import { SmartPanel } from "./SmartPanel";
import { EisenhowerPanel } from "./EisenhowerPanel";
import { S5Panel } from "./S5Panel";
import { PdcaPanel } from "./PdcaPanel";

const TABS = [
  { key: "ishikawa", icon: "🐟", label: "Ishikawa" },
  { key: "porques", icon: "❓", label: "5 Porquês" },
  { key: "smart", icon: "🎯", label: "SMART" },
  { key: "eisenhower", icon: "⚡", label: "Eisenhower" },
  { key: "5s", icon: "🧹", label: "5S" },
  { key: "pdca", icon: "🔄", label: "PDCA" },
] as const;

type TabKey = typeof TABS[number]["key"];
const TAB_KEYS = TABS.map(t => t.key) as string[];

const PANELS: Record<TabKey, React.FC> = {
  ishikawa: IshikawaPanel,
  porques: PorquesPanel,
  smart: SmartPanel,
  eisenhower: EisenhowerPanel,
  "5s": S5Panel,
  pdca: PdcaPanel,
};

function HubInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramKey = searchParams.get("t");
  const initial: TabKey = TAB_KEYS.includes(paramKey || "") ? (paramKey as TabKey) : "ishikawa";
  const [active, setActive] = useState<TabKey>(initial);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const p = searchParams.get("t");
    if (p && TAB_KEYS.includes(p) && p !== active) setActive(p as TabKey);
  }, [searchParams]);

  const switchTab = useCallback((key: TabKey) => {
    setActive(key);
    const url = new URL(window.location.href);
    url.searchParams.set("t", key);
    router.replace(url.pathname + url.search, { scroll: false });
  }, [router]);

  function copyLink() {
    const url = new URL(window.location.href);
    url.searchParams.set("t", active);
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const Panel = PANELS[active];

  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>

      {/* ─── Sticky header ─── */}
      <header style={{
        background: "var(--navy)",
        color: "var(--white)",
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

          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 36, height: 36,
              background: "var(--gold)", borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-serif, serif)",
              fontSize: 15, color: "var(--navy)", fontWeight: 700,
              letterSpacing: "-0.5px", flexShrink: 0,
            }}>MC</div>
            <div>
              <div style={{ fontFamily: "var(--font-serif, serif)", fontSize: 16, color: "var(--white)", lineHeight: 1.1 }}>
                Melhoria Contínua
              </div>
              <div style={{ fontSize: 10, color: "var(--gold-light, #e2c47a)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                Ferramentas de Gestão · IA Integrada
              </div>
            </div>
          </div>

          {/* Nav + copy link */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <nav style={{ display: "flex", gap: 2 }}>
              {TABS.map(tab => {
                const isActive = active === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => switchTab(tab.key)}
                    style={{
                      background: isActive ? "var(--gold)" : "none",
                      border: "none",
                      color: isActive ? "var(--navy)" : "rgba(255,255,255,0.55)",
                      fontFamily: "inherit",
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      padding: "8px 14px",
                      cursor: "pointer",
                      borderRadius: 8,
                      transition: "all 0.15s",
                      letterSpacing: "0.3px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tab.icon} {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Copy link button */}
            <button
              onClick={copyLink}
              title="Copiar link desta ferramenta"
              style={{
                marginLeft: 8,
                background: copied ? "rgba(26,107,74,0.25)" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 8,
                color: copied ? "#6ee7b7" : "rgba(255,255,255,0.7)",
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
            >
              {copied ? "✓ Copiado!" : "🔗 Copiar link"}
            </button>

            {/* Minhas Ações link */}
            <a
              href="/minhas-acoes"
              style={{
                background: "rgba(201,168,76,0.15)",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: 8,
                color: "var(--gold-light, #e2c47a)",
                fontSize: 12,
                fontWeight: 500,
                padding: "6px 12px",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              💾 Minhas Ações
            </a>
          </div>
        </div>
      </header>

      {/* ─── Panel ─── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <Panel />
      </main>
    </div>
  );
}

export function HubDashboard() {
  return (
    <Suspense>
      <HubInner />
    </Suspense>
  );
}
