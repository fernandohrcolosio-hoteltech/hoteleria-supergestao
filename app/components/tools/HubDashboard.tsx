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
      {/* Header */}
      <header style={{
        background: "var(--navy)",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "3px solid var(--gold)",
      }}>
        <div>
          <div style={{
            display: "inline-block",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: 4,
          }}>
            HoteleriA · SuperGestão
          </div>
          <h1 className="font-serif" style={{ fontSize: 24, color: "var(--white)", margin: 0 }}>
            Hub de Melhoria Contínua
          </h1>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", textAlign: "right" }}>
          6 ferramentas de gestão<br />com análise por IA
        </div>
      </header>

      {/* Tab bar */}
      <div style={{
        background: "var(--white)",
        borderBottom: "1px solid var(--border)",
        padding: "0 32px",
        overflowX: "auto",
        display: "flex",
        gap: 4,
      }}>
        {TABS.map(tab => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 18px",
                border: "none",
                borderBottom: isActive ? "3px solid var(--gold)" : "3px solid transparent",
                background: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "var(--navy)" : "var(--text-muted)",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.15s",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Panel content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 32px 64px" }}>
        <Panel />
      </div>
    </div>
  );
}
