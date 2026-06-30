import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { PdcaPanel } from "@/app/components/tools/PdcaPanel";

export default function PdcaPage() {
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <StandaloneHeader icon="🔄" name="Ciclo PDCA" badge="Melhoria Contínua · IA Integrada" toolSlug="pdca" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <PdcaPanel />
      </main>
    </div>
  );
}
