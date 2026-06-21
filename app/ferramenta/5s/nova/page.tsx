"use client";

import { createToolEntry } from "@/app/actions/tool-entries";
import { S5Form } from "@/app/components/S5Form";
import Link from "next/link";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { getUser } from "@/app/actions/auth";

export default function Tool5SNova() {
  const [entryId, setEntryId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function init() {
      const user = await getUser();
      if (!user) redirect("/login");

      const { entry, error: createError } = await createToolEntry("5s", "Nova Análise", {});

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
          <Link href="/ferramenta/5s" style={{ color: "rgba(255,255,255,0.7)" }}>
            ← Voltar
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <S5Form entryId={entryId} />
      </div>
    </main>
  );
}
