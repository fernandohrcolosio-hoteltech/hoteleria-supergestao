"use client";

import { getUser } from "@/app/actions/auth";
import { createToolEntry } from "@/app/actions/tool-entries";
import { IshikawaForm } from "@/app/components/IshikawaForm";
import Link from "next/link";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default function IshikawaNova() {
  const [entryId, setEntryId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Create blank entry on load
    async function init() {
      const user = await getUser();
      if (!user) {
        redirect("/login");
      }

      const { entry, error: createError } = await createToolEntry(
        "ishikawa",
        "Nova Análise",
        {
          problema: "",
          mao_obra: "",
          maquina: "",
          material: "",
          metodo: "",
          meio_ambiente: "",
          medicao: "",
        }
      );

      if (createError) {
        setError(createError);
        return;
      }

      if (entry) {
        setEntryId(entry.id);
        setName(entry.name);
      }
    }

    init();
  }, []);

  if (!entryId) {
    return (
      <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }} className="flex items-center justify-center">
        <p style={{ color: "var(--text-muted)" }}>Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: "#c0392b" }}>{error}</p>
          <Link href="/ferramenta/ishikawa" style={{ color: "var(--navy)" }}>
            Voltar
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="text-white py-8 px-6"
        style={{ backgroundColor: "var(--navy)" }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif">Nova Análise - Ishikawa</h1>
          </div>
          <Link
            href="/ferramenta/ishikawa"
            style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}
          >
            ← Voltar
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <IshikawaForm entryId={entryId} />
      </div>
    </main>
  );
}
