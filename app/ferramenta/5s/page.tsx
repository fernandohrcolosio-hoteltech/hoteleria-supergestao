import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { S5Panel } from "@/app/components/tools/S5Panel";

export default function S5Page() {
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <StandaloneHeader icon="🧹" name="Programa 5S" badge="Organização e Padronização · IA Integrada" toolSlug="5s" />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <S5Panel />
      </main>
    </div>
  );
}
