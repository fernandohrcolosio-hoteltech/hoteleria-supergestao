"use client";
import { useState, Suspense } from "react";
import { StandaloneHeader } from "@/app/components/tools/StandaloneHeader";
import { S5Panel } from "@/app/components/tools/S5Panel";
import { PlusAutoActivate } from "@/app/components/tools/PlusAutoActivate";

const SLUG = "5s";

export default function S5Page() {
  const [plusKey, setPlusKey] = useState(0);
  return (
    <div style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <Suspense>
        <PlusAutoActivate toolSlug={SLUG} onActivated={() => setPlusKey(k => k + 1)} />
      </Suspense>
      <StandaloneHeader icon="🧹" name="Programa 5S" badge="Organização e Padronização · IA Integrada" toolSlug={SLUG} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px 80px" }}>
        <S5Panel key={plusKey} />
      </main>
    </div>
  );
}
