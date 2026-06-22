"use client";
import { useState } from "react";
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

const PANELS: Record<TabKey, React.FC> = {
  ishikawa: IshikawaPanel,
  porques: PorquesPanel,
  smart: SmartPanel,
  eisenhower: EisenhowerPanel,
  "5s": S5Panel,
  pdca: PdcaPanel,
};

export function HubDashboard() {
  const [active, setActive] = useState<TabKey>("ishikawa");
  const Panel = PANELS[active];

  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>

      {/* ─── Sticky header com nav ─── */}
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
              background: "var(--gold)",
              borderRadius: 10,
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

          {/* Nav */}
          <nav style={{ display: "flex", gap: 4 }}>
            {TABS.map(tab => {
              const isActive = active === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActive(tab.key)}
                  style={{
                    background: isActive ? "var(--gold)" : "none",
                    border: "none",
                    color: isActive ? "var(--navy)" : "rgba(255,255,255,0.55)",
                    fontFamily: "inherit",
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 500,
                    padding: "8px 16px",
                    cursor: "pointer",
                    borderRadius: 8,
                    transition: "all 0.2s",
                    letterSpacing: "0.3px",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "white"; (e.currentTarget as HTMLButtonElement).style.background = isActive ? "var(--gold)" : "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.55)"; (e.currentTarget as HTMLButtonElement).style.background = "none"; } }}
                >
                  {tab.icon} {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ─── Panel content ─── */}
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <Panel />
      </main>
    </div>
  );
}
