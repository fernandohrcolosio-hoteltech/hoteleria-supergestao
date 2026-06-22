import { listToolEntries } from "@/app/actions/tool-entries";
import Link from "next/link";

export default async function PorquesListPage() {
  const { entries } = await listToolEntries("porques");

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <header className="text-white py-8 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">❓</span>
            <div>
              <h1 className="text-3xl font-serif">5 Porquês</h1>
              <p className="text-sm opacity-75">Minhas análises</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link
            href="/ferramenta/porques/nova"
            className="inline-block px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "var(--navy)" }}
          >
            + Nova Análise
          </Link>
        </div>

        {!entries || entries.length === 0 ? (
          <p style={{ color: "var(--text-muted)" }}>Nenhuma análise salva.</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/ferramenta/porques/${entry.id}`}
                className="block p-4 rounded-lg border hover:shadow-md transition-all"
                style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}
              >
                <h3 className="font-semibold" style={{ color: "var(--navy)" }}>
                  {entry.name}
                </h3>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {new Date(entry.updated_at).toLocaleDateString("pt-BR")}
                </p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/dashboard"
            className="text-sm"
            style={{ color: "var(--navy)", textDecoration: "underline" }}
          >
            ← Voltar
          </Link>
        </div>
      </div>
    </main>
  );
}
