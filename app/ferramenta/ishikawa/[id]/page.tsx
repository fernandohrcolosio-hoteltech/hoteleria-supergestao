import { getUser } from "@/app/actions/auth";
import { getToolEntry } from "@/app/actions/tool-entries";
import { IshikawaForm } from "@/app/components/IshikawaForm";
import Link from "next/link";
import { redirect } from "next/navigation";

interface IshikawaPageProps {
  params: Promise<{ id: string }>;
}

export default async function IshikawaPage({ params }: IshikawaPageProps) {
  const { id } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const { entry, error } = await getToolEntry(id);

  if (error || !entry) {
    return (
      <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }} className="flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: "#c0392b" }}>Análise não encontrada</p>
          <Link href="/ferramenta/ishikawa" style={{ color: "var(--navy)" }}>
            Voltar para lista
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
            <h1 className="text-2xl font-serif">{entry.name}</h1>
            <p className="text-sm opacity-75">
              {new Date(entry.updated_at).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
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
        <IshikawaForm entryId={entry.id} initialData={entry.data as any} />
      </div>
    </main>
  );
}
