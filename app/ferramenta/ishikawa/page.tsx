import { getUser } from "@/app/actions/auth";
import { listToolEntries } from "@/app/actions/tool-entries";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function IshikawaListPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  // Check access
  const { data: access } = await supabase
    .from("user_tool_access")
    .select("*")
    .eq("user_id", user.id)
    .eq("tool_slug", "ishikawa")
    .single();

  if (!access) redirect("/dashboard");

  const { entries } = await listToolEntries("ishikawa");

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="text-white py-8 px-6"
        style={{ backgroundColor: "var(--navy)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🐟</span>
            <div>
              <h1 className="text-3xl font-serif">Diagrama de Ishikawa</h1>
              <p className="text-sm opacity-75">Minhas análises</p>
            </div>
          </div>
          <p className="text-sm opacity-70">
            Identifique causas raiz de problemas mapeando fatores por categoria
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* CTA */}
        <div className="mb-8">
          <Link
            href="/ferramenta/ishikawa/nova"
            className="inline-block px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "var(--navy)" }}
          >
            + Nova Análise
          </Link>
        </div>

        {/* List */}
        {!entries || entries.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color: "var(--text-muted)" }}>
              Você ainda não tem análises salvas.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <Link
                key={entry.id}
                href={`/ferramenta/ishikawa/${entry.id}`}
                className="block p-4 rounded-lg border hover:shadow-md transition-all"
                style={{
                  backgroundColor: "var(--white)",
                  borderColor: "var(--border)",
                }}
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

        {/* Back */}
        <div className="mt-12">
          <Link
            href="/dashboard"
            className="text-sm"
            style={{ color: "var(--navy)", textDecoration: "underline" }}
          >
            ← Voltar ao dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
