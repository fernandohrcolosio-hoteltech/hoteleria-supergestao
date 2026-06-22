import Link from "next/link";

const TOOLS = [
  { icon: "🐟", name: "Diagrama de Ishikawa", desc: "Mapeie causas raiz por categoria (6M)", slug: "ishikawa" },
  { icon: "❓", name: "5 Porquês", desc: "Aprofunde a análise até a causa real", slug: "porques" },
  { icon: "🎯", name: "Metas SMART", desc: "Estruture metas claras e mensuráveis", slug: "smart" },
  { icon: "⚡", name: "Matriz de Eisenhower", desc: "Priorize tarefas por urgência e importância", slug: "eisenhower" },
  { icon: "🧹", name: "Programa 5S", desc: "Avalie e organize seu ambiente de trabalho", slug: "5s" },
  { icon: "🔄", name: "Ciclo PDCA", desc: "Plan, Do, Check, Act — melhoria contínua", slug: "pdca" },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh", fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* ─── Hero ─── */}
      <header style={{
        background: "var(--navy)",
        color: "var(--white)",
        padding: "64px 32px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
          background: "var(--cream)", borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          transform: "scale(1.6)",
        }} />
        <div style={{ position: "relative", zIndex: 10, maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-block", padding: "6px 18px", borderRadius: 20,
            background: "rgba(201,168,76,0.15)", color: "var(--gold-light, #e2c47a)",
            fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24,
          }}>
            Gestão · Qualidade · IA
          </div>

          <h1 className="font-serif" style={{ fontSize: 46, lineHeight: 1.1, marginBottom: 18 }}>
            Hub de Melhoria Contínua<br />
            <span style={{ color: "var(--gold-light, #e2c47a)" }}>com Inteligência Artificial</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 17, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6 }}>
            6 ferramentas de gestão — Ishikawa, 5 Porquês, SMART, Eisenhower, 5S e PDCA — com análise integrada por IA para gestores hoteleiros.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://kiwify.com.br"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--gold)", color: "var(--navy)",
                border: "none", borderRadius: 12, padding: "14px 28px",
                fontSize: 15, fontWeight: 700, cursor: "pointer",
                textDecoration: "none", letterSpacing: "0.2px",
              }}
            >
              Comprar Acesso
            </a>
            <Link
              href="/dashboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "var(--white)",
                border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "14px 28px",
                fontSize: 15, fontWeight: 500, cursor: "pointer",
                textDecoration: "none",
              }}
            >
              Já tenho acesso →
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Ferramentas ─── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 10 }}>
            6 Ferramentas em um só lugar
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Cada ferramenta tem formulário guiado e análise por IA ao final — prática, objetiva, voltada para operações hoteleiras.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TOOLS.map(tool => (
            <Link
              key={tool.slug}
              href={`/ferramenta/${tool.slug}`}
              style={{
                background: "var(--white)", border: "1px solid var(--border)",
                borderRadius: 16, padding: "28px 24px",
                boxShadow: "0 4px 24px rgba(13,27,42,0.06)",
                textDecoration: "none", display: "block",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{tool.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{tool.name}</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 14 }}>{tool.desc}</div>
              <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>Acessar →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Como funciona ─── */}
      <section style={{ background: "var(--white)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 32px", textAlign: "center" }}>
          <h2 className="font-serif" style={{ fontSize: 30, color: "var(--navy)", marginBottom: 12 }}>
            Como funciona
          </h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 48, fontSize: 15 }}>
            Simples e direto — sem login, sem app para instalar.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            {[
              { num: "1", title: "Compre no Kiwify", desc: "Acesso imediato após o pagamento. Cartão, Pix ou boleto." },
              { num: "2", title: "Acesse o Hub", desc: "Você recebe o link direto. Clique e já está dentro — sem senha." },
              { num: "3", title: "Use com IA", desc: "Preencha a ferramenta e clique em Analisar. A IA entrega o diagnóstico." },
            ].map(step => (
              <div key={step.num}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--gold)", color: "var(--navy)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-serif, serif)", fontSize: 22, fontWeight: 700,
                  margin: "0 auto 16px",
                }}>{step.num}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "var(--navy)", marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA final ─── */}
      <section style={{ textAlign: "center", padding: "64px 32px" }}>
        <h2 className="font-serif" style={{ fontSize: 30, color: "var(--navy)", marginBottom: 16 }}>
          Pronto para começar?
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 15 }}>
          Acesso a todas as 6 ferramentas com IA integrada.
        </p>
        <a
          href="https://kiwify.com.br"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--navy)", color: "var(--white)",
            borderRadius: 12, padding: "14px 32px",
            fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}
        >
          Comprar no Kiwify →
        </a>
        <div style={{ marginTop: 20 }}>
          <Link href="/dashboard" style={{ color: "var(--text-muted)", fontSize: 14, textDecoration: "underline" }}>
            Já comprei — acessar as ferramentas
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", textAlign: "center", padding: "24px 32px", color: "var(--text-muted)", fontSize: 13 }}>
        Hub de Melhoria Contínua · IA integrada para gestores hoteleiros
      </footer>
    </main>
  );
}
