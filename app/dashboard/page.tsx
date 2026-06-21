import { getUser } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/app/components/UserMenu";
import { redirect } from "next/navigation";
import { TOOLS } from "@/lib/types";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  // Get user's tool access
  const { data: toolAccess } = await supabase
    .from("user_tool_access")
    .select("tool_slug")
    .eq("user_id", user.id);

  const userTools = toolAccess?.map((ta) => ta.tool_slug) || [];

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      {/* Header */}
      <header className="bg-navy text-white py-6 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif">Dashboard</h1>
            <p className="text-sm opacity-75">Suas ferramentas de melhoria contínua</p>
          </div>
          <UserMenu email={user.email || "usuário"} />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {userTools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg mb-6" style={{ color: "var(--text-muted)" }}>
              Você ainda não tem acesso a nenhuma ferramenta.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-2 rounded-lg text-white font-semibold"
              style={{ backgroundColor: "var(--navy)" }}
            >
              Ir para Vitrine
            </Link>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-serif mb-8" style={{ color: "var(--navy)" }}>
              Minhas Ferramentas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTools.map((toolSlug) => {
                const tool = TOOLS[toolSlug as keyof typeof TOOLS];
                if (!tool) return null;

                return (
                  <Link
                    key={toolSlug}
                    href={`/ferramenta/${toolSlug}`}
                    className="rounded-2xl p-6 border text-decoration-none transition-all hover:-translate-y-1"
                    style={{
                      backgroundColor: "var(--white)",
                      borderColor: "var(--border)",
                    }}
                  >
                    <div className="text-4xl mb-4">{tool.icon}</div>
                    <div className="text-xs font-semibold mb-2" style={{ color: "var(--gold)" }}>
                      {tool.badge}
                    </div>
                    <h3 className="text-lg font-serif mb-2" style={{ color: "var(--navy)" }}>
                      {tool.name}
                    </h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                      Acessar ferramenta →
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
