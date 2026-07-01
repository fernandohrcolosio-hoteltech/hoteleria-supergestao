import Link from "next/link";

const TOOLS = [
  { icon: "🐟", name: "Diagrama de Ishikawa", desc: "Mapeie causas raiz por categoria (6M)", slug: "ishikawa",   basicUrl: "https://pay.kiwify.com.br/MqZDQPx", plusUrl: "https://pay.kiwify.com.br/m9u84cduwt0" },
  { icon: "❓", name: "5 Porquês",            desc: "Aprofunde a análise até a causa real",  slug: "porques",    basicUrl: "https://pay.kiwify.com.br/r7fcL2N", plusUrl: "https://pay.kiwify.com.br/ds537bwe5o6" },
  { icon: "🎯", name: "Metas SMART",          desc: "Estruture metas claras e mensuráveis",  slug: "smart",      basicUrl: "https://pay.kiwify.com.br/mm2pb8R", plusUrl: "https://pay.kiwify.com.br/olpea9bbp1a" },
  { icon: "⚡", name: "Matriz de Eisenhower", desc: "Priorize tarefas por urgência e importância", slug: "eisenhower", basicUrl: "https://pay.kiwify.com.br/U9oIJ6A", plusUrl: "https://pay.kiwify.com.br/bttw0g9fn0b" },
  { icon: "🧹", name: "Programa 5S",          desc: "Avalie e organize seu ambiente",        slug: "5s",         basicUrl: "https://pay.kiwify.com.br/qo90r2u", plusUrl: "https://pay.kiwify.com.br/2ALcA4a" },
  { icon: "🔄", name: "Ciclo PDCA",           desc: "Plan, Do, Check, Act — melhoria contínua", slug: "pdca",   basicUrl: "https://pay.kiwify.com.br/uGFRKDV", plusUrl: "https://pay.kiwify.com.br/6yUDRQp" },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: "var(--cream)", minHeight: "100vh", fontFamily: "var(--font-sans, sans-serif)" }}>

      {/* ─── Hero ─── */}
      <header style={{
        background: "var(--navy)", color: "var(--white)",
        padding: "64px 32px 80px", textAlign: "center",
        position: "relative", overflow: "hidden",
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
            6 ferramentas de gestão com análise integrada por IA — para gestores hoteleiros que querem resultados reais.
          </p>
        </div>
      </header>

      {/* ─── Ferramentas ─── */}
      <section id="ferramentas" style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="font-serif" style={{ fontSize: 32, color: "var(--navy)", marginBottom: 10 }}>
            6 Ferramentas em um só lugar
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 16, maxWidth: 500, margin: "0 auto" }}>
            Cada ferramenta tem formulário guiado e análise por IA — prática, objetiva, para operações hoteleiras.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {TOOLS.map(tool => (
            <a key={tool.slug} href={tool.basicUrl} target="_blank" rel="noopener noreferrer" style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 4px 24px rgba(13,27,42,0.06)",
              textDecoration: "none", display: "block",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{tool.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{tool.name}</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 14 }}>{tool.desc}</div>
              <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>Ver ferramenta →</div>
            </a>
          ))}
        </div>

        {/* Já comprei */}
        <div style={{ textAlign: "center", marginTop: 48 }}>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 12 }}>
            Já comprou? Acesse diretamente com seu código.
          </p>
          <Link href="/minhas-acoes" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "transparent", color: "var(--text-muted)",
            border: "1px solid var(--border)", borderRadius: 10, padding: "10px 22px",
            fontSize: 14, textDecoration: "none",
          }}>
            Já comprei — acessar →
          </Link>
        </div>
      </section>

      {/* ─── Preços (oculto — preços mostrados no Kiwify) ─── */}
      <section id="precos" style={{ display: "none" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{
              display: "inline-block", padding: "5px 16px", borderRadius: 20,
              background: "rgba(201,168,76,0.15)", color: "var(--gold-light, #e2c47a)",
              fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16,
            }}>
              Planos e Preços
            </div>
            <h2 className="font-serif" style={{ fontSize: 34, color: "var(--white)", margin: "0 0 12px" }}>
              Escolha a ferramenta e o plano
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, maxWidth: 520, margin: "0 auto 16px" }}>
              Cada ferramenta é vendida separadamente. Basic para usar com IA, Plus para salvar e acompanhar as ações.
            </p>
          </div>

          {/* Legenda */}
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(255,255,255,0.2)" }} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>Basic — R$ 19,90 · Ferramenta + IA</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--gold)" }} />
              <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 13 }}>✦ Plus — R$ 59,90 · + Plano de Ação salvo</span>
            </div>
          </div>

          {/* Grade de ferramentas */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {TOOLS.map(tool => (
              <div key={tool.slug} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 16, overflow: "hidden",
              }}>
                {/* Cabeçalho da ferramenta */}
                <div style={{ padding: "20px 20px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{tool.icon}</span>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "var(--white)", lineHeight: 1.2 }}>{tool.name}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{tool.desc}</div>
                </div>

                {/* Botões de compra */}
                <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <a href={tool.basicUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10, padding: "10px 14px", textDecoration: "none",
                  }}>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>Basic</span>
                    <span style={{ fontSize: 14, color: "var(--white)", fontWeight: 700, fontFamily: "serif" }}>R$ 19,90</span>
                    <span style={{ fontSize: 12, color: "var(--gold-light, #e2c47a)", fontWeight: 600 }}>Comprar →</span>
                  </a>
                  <a href={tool.plusUrl} target="_blank" rel="noopener noreferrer" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)",
                    borderRadius: 10, padding: "10px 14px", textDecoration: "none",
                  }}>
                    <span style={{ fontSize: 12, color: "var(--gold-light, #e2c47a)", fontWeight: 700 }}>✦ Plus</span>
                    <span style={{ fontSize: 14, color: "var(--white)", fontWeight: 700, fontFamily: "serif" }}>R$ 59,90</span>
                    <span style={{ fontSize: 12, color: "var(--gold-light, #e2c47a)", fontWeight: 600 }}>Comprar →</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Nota */}
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 28 }}>
            Acesso vitalício · Sem mensalidade · Pagamento via Kiwify (cartão, Pix ou boleto)
          </p>
        </div>
      </section>


      <footer style={{ borderTop: "1px solid var(--border)", textAlign: "center", padding: "24px 32px", color: "var(--text-muted)", fontSize: 13 }}>
        Hub de Melhoria Contínua · IA integrada para gestores hoteleiros
      </footer>
    </main>
  );
}
