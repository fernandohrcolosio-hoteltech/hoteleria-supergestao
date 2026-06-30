"use client";
import { useState, Suspense } from "react";
import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { EisenhowerPanel } from "@/app/components/tools/EisenhowerPanel";
import { PlusAutoActivate } from "@/app/components/tools/PlusAutoActivate";

const SLUG = "eisenhower";

export default function EisenhowerPage() {
  const [plusKey, setPlusKey] = useState(0);
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Suspense>
        <PlusAutoActivate toolSlug={SLUG} onActivated={() => setPlusKey(k => k + 1)} />
      </Suspense>
      <StandaloneHeader icon="⚡" name="Matriz de Eisenhower" badge="Gestão de Prioridades · IA Integrada" toolSlug={SLUG} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <EisenhowerPanel key={plusKey} />
      </main>
    </div>
  );
}
