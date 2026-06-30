"use client";
import { useState, Suspense } from "react";
import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { PorquesPanel } from "@/app/components/tools/PorquesPanel";
import { PlusAutoActivate } from "@/app/components/tools/PlusAutoActivate";

const SLUG = "porques";

export default function PorquesPage() {
  const [plusKey, setPlusKey] = useState(0);
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Suspense>
        <PlusAutoActivate toolSlug={SLUG} onActivated={() => setPlusKey(k => k + 1)} />
      </Suspense>
      <StandaloneHeader icon="❓" name="5 Porquês" badge="Análise de Causa Raiz · IA Integrada" toolSlug={SLUG} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <PorquesPanel key={plusKey} />
      </main>
    </div>
  );
}
