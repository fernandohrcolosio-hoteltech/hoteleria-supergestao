import { TOOLS } from "@/lib/types";
import Link from "next/link";

export default function DashboardPage() {
  const toolSlugs = Object.keys(TOOLS);

  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh" }}>
      <header className="text-white py-6 px-6" style={{ backgroundColor: "var(--navy)" }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-serif">Hub de Melhoria Contínua</h1>
          <p className="text-sm opacity-75">Suas ferramentas de gestão</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-serif mb-8" style={{ color: "var(--navy)" }}>
          Ferramentas Disponíveis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolSlugs.map((toolSlug) => {
            const tool = TOOLS[toolSlug as keyof typeof TOOLS];
            if (!tool) return null;

            return (
              <Link
                key={toolSlug}
                href={`/ferramenta/${toolSlug}`}
                className="rounded-2xl p-6 border transition-all hover:-translate-y-1"
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
    </main>
  );
}
