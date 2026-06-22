"use client";

import { createToolEntry } from "@/app/actions/tool-entries";
import { PdcaForm } from "@/app/components/PdcaForm";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function ToolPDCANova() {
  const [entryId, setEntryId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const { entry, error: createError } = await createToolEntry("pdca", "Nova Análise", {});

      if (createError) {
        setError(createError);
        return;
      }

      if (entry) setEntryId(entry.id);
    }

    init();
  }, []);

  if (!entryId) {
    return (
      <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }} className="flex items-center justify-center">
        <p>{error || "Carregando..."}</p>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <header className="text-white py-8 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-serif">Nova Análise</h1>
          <Link href="/ferramenta/pdca" style={{ color: "rgba(255,255,255,0.7)" }}>
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <PdcaForm entryId={entryId} />
      </div>
    </main>
  );
}
