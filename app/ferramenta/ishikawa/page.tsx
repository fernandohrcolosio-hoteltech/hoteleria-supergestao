"use client";
import { useState, Suspense } from "react";
import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { IshikawaPanel } from "@/app/components/tools/IshikawaPanel";
import { PlusAutoActivate } from "@/app/components/tools/PlusAutoActivate";

const SLUG = "ishikawa";

export default function IshikawaPage() {
  const [plusKey, setPlusKey] = useState(0);
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Suspense>
        <PlusAutoActivate toolSlug={SLUG} onActivated={() => setPlusKey(k => k + 1)} />
      </Suspense>
      <StandaloneHeader icon="🐟" name="Diagrama de Ishikawa" badge="Causa e Efeito · IA Integrada" toolSlug={SLUG} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <IshikawaPanel key={plusKey} />
      </main>
    </div>
  );
}
