import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { PorquesPanel } from "@/app/components/tools/PorquesPanel";

export default function PorquesPage() {
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <StandaloneHeader icon="❓" name="5 Porquês" badge="Análise de Causa Raiz · IA Integrada" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <PorquesPanel />
      </main>
    </div>
  );
}
