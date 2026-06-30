import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { IshikawaPanel } from "@/app/components/tools/IshikawaPanel";

export default function IshikawaPage() {
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <StandaloneHeader icon="🐟" name="Diagrama de Ishikawa" badge="Causa e Efeito · IA Integrada" toolSlug="ishikawa" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <IshikawaPanel />
      </main>
    </div>
  );
}
