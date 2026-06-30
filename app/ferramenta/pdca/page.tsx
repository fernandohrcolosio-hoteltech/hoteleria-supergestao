"use client";
import { useState, Suspense } from "react";
import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { PdcaPanel } from "@/app/components/tools/PdcaPanel";
import { PlusAutoActivate } from "@/app/components/tools/PlusAutoActivate";

const SLUG = "pdca";

export default function PdcaPage() {
  const [plusKey, setPlusKey] = useState(0);
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Suspense>
        <PlusAutoActivate toolSlug={SLUG} onActivated={() => setPlusKey(k => k + 1)} />
      </Suspense>
      <StandaloneHeader icon="🔄" name="Ciclo PDCA" badge="Melhoria Contínua · IA Integrada" toolSlug={SLUG} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <PdcaPanel key={plusKey} />
      </main>
    </div>
  );
}
