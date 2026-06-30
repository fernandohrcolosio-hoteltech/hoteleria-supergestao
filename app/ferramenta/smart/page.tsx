"use client";
import { useState, Suspense } from "react";
import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { SmartPanel } from "@/app/components/tools/SmartPanel";
import { PlusAutoActivate } from "@/app/components/tools/PlusAutoActivate";

const SLUG = "smart";

export default function SmartPage() {
  const [plusKey, setPlusKey] = useState(0);
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Suspense>
        <PlusAutoActivate toolSlug={SLUG} onActivated={() => setPlusKey(k => k + 1)} />
      </Suspense>
      <StandaloneHeader icon="🎯" name="Metas SMART" badge="Definição de Metas · IA Integrada" toolSlug={SLUG} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <SmartPanel key={plusKey} />
      </main>
    </div>
  );
}
