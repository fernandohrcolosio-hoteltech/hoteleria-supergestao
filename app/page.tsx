import { createClient } from "@/lib/supabase/server";
import { PlanCard } from "@/app/components/PlanCard";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .eq("active", true)
    .order("price_brl", { ascending: true });

  const avulsos = plans?.filter((p) => p.type === "avulso") || [];
  const pacotes = plans?.filter((p) => p.type === "pacote") || [];

  return (
    <main className="flex-1" style={{ backgroundColor: "var(--cream)" }}>
      {/* Header */}
      <header
        className="text-white py-20 px-6 text-center relative overflow-hidden"
        style={{ backgroundColor: "var(--navy)" }}
      >
        <div
          className="absolute bottom-0 left-0 right-0 h-20 rounded-t-full"
          style={{
            backgroundColor: "var(--cream)",
            transform: "scale(1.5)",
          }}
        ></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-block px-4 py-2 rounded-full text-xs font-semibold uppercase mb-6"
            style={{
              backgroundColor: "rgba(201, 168, 76, 0.15)",
              color: "var(--gold-light)",
              letterSpacing: "1.5px",
            }}
          >
            Gestão · Qualidade · IA
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">
            Ferramentas de Melhoria
            <br />
            Contínua com IA
          </h1>

          <p className="text-white/70 text-lg max-w-lg mx-auto">
            Cada ferramenta é independente. Contrate apenas o que sua operação precisa.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12 -mt-8 relative z-20">
        {/* Avulsos */}
        <div className="mb-20">
          <h2 className="text-3xl font-serif mb-2" style={{ color: "var(--navy)" }}>
            Ferramentas Individuais
          </h2>
          <p className="mb-8" style={{ color: "var(--text-muted)" }}>
            Escolha exatamente o que você precisa — R$ 9,90 por mês
          </p>

          {avulsos.length === 0 ? (
            <div className="p-4 rounded" style={{ backgroundColor: "#fee", color: "#c00" }}>
              Nenhuma ferramenta disponível no momento
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {avulsos.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>

        {/* Pacotes */}
        {pacotes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif mb-2" style={{ color: "var(--navy)" }}>
              Pacote Completo
            </h2>
            <p className="mb-8" style={{ color: "var(--text-muted)" }}>
              Todas as 6 ferramentas por R$ 49,90 por mês
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pacotes.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-20 text-center">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Já tem conta?{" "}
            <Link href="/login" style={{ color: "var(--navy)", textDecoration: "underline" }}>
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="border-t text-center py-8 px-6 text-sm"
        style={{
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
      >
        Hub de Melhoria Contínua · Ferramentas com IA integrada
      </footer>
    </main>
  );
}
