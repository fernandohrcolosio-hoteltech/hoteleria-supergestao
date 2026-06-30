import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { EisenhowerPanel } from "@/app/components/tools/EisenhowerPanel";

export default function EisenhowerPage() {
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <StandaloneHeader icon="⚡" name="Matriz de Eisenhower" badge="Gestão de Prioridades · IA Integrada" toolSlug="eisenhower" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <EisenhowerPanel />
      </main>
    </div>
  );
}
