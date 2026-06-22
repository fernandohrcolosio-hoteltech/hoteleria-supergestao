import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { SmartPanel } from "@/app/components/tools/SmartPanel";

export default function SmartPage() {
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <StandaloneHeader icon="🎯" name="Metas SMART" badge="Definição de Metas · IA Integrada" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <SmartPanel />
      </main>
    </div>
  );
}
