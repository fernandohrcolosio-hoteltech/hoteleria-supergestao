import Link from "next/link";

const TOOLS = [
  { icon: "🐟", name: "Diagrama de Ishikawa", desc: "Mapeie causas raiz por categoria (6M)", slug: "ishikawa" },
  { icon: "❓", name: "5 Porquês",            desc: "Aprofunde a análise até a causa real",    slug: "porques" },
  { icon: "🎯", name: "Metas SMART",          desc: "Estruture metas claras e mensuráveis",   slug: "smart" },
  { icon: "⚡", name: "Matriz de Eisenhower", desc: "Priorize tarefas por urgência e importância", slug: "eisenhower" },
  { icon: "🧹", name: "Programa 5S",          desc: "Avalie e organize seu ambiente",         slug: "5s" },
  { icon: "🔄", name: "Ciclo PDCA",           desc: "Plan, Do, Check, Act — melhoria contínua", slug: "pdca" },
];

// TODO: substituir pelos links reais do Kiwify após criar os produtos
const KIWIFY = {
  basicTool:  "https://kiwify.com.br",
  basicPack:  "https://kiwify.com.br",
  plusTool:   "https://kiwify.com.br",
  plusPack:   "https://kiwify.com.br",
};

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
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#precos" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--gold)", color: "var(--navy)",
              borderRadius: 12, padding: "14px 28px",
              fontSize: 15, fontWeight: 700, textDecoration: "none",
            }}>
              Ver planos e preços
            </a>
            <Link href="/dashboard" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "transparent", color: "var(--white)",
              border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 12, padding: "14px 28px",
              fontSize: 15, fontWeight: 500, textDecoration: "none",
            }}>
              Já tenho acesso →
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Ferramentas ─── */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "64px 32px 48px" }}>
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
            <Link key={tool.slug} href={`/ferramenta/${tool.slug}`} style={{
              background: "var(--white)", border: "1px solid var(--border)",
              borderRadius: 16, padding: "28px 24px",
              boxShadow: "0 4px 24px rgba(13,27,42,0.06)",
              textDecoration: "none", display: "block",
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{tool.icon}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", marginBottom: 6 }}>{tool.name}</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 14 }}>{tool.desc}</div>
              <div style={{ fontSize: 12, color: "var(--gold)", fontWeight: 600 }}>Ver ferramenta →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Preços ─── */}
      <section id="precos" style={{ background: "var(--navy)", padding: "72px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div style={{
              display: "inline-block", padding: "5px 16px", borderRadius: 20,
              background: "rgba(201,168,76,0.15)", color: "var(--gold-light, #e2c47a)",
              fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 16,
            }}>
              Planos e Preços
            </div>
            <h2 className="font-serif" style={{ fontSize: 34, color: "var(--white)", margin: "0 0 12px" }}>
              Escolha o plano ideal para você
            </h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
              Acesso individual por ferramenta ou pacote completo. Basic para usar, Plus para salvar e acompanhar.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

            {/* ── Basic ── */}
            <div style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 20, overflow: "hidden",
            }}>
              <div style={{ padding: "28px 28px 24px" }}>
                <div style={{
                  display: "inline-block", background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 700,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: 20, marginBottom: 16,
                }}>
                  Basic
                </div>
                <h3 className="font-serif" style={{ fontSize: 24, color: "var(--white)", margin: "0 0 12px" }}>
                  Ferramenta + IA
                </h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
                  Acesso completo à ferramenta com análise por IA. Ideal para uso pontual e diagnósticos rápidos.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                  {[
                    "Formulário guiado com IA",
                    "Análise inteligente do problema",
                    "Sem necessidade de login",
                    "Acesso vitalício",
                  ].map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: "var(--gold-light, #e2c47a)", fontSize: 14 }}>✓</span>
                      <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 14 }}>{f}</span>
                    </li>
                  ))}
                  {[
                    "Plano de ação salvo",
                    "Histórico entre dispositivos",
                  ].map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 14 }}>✕</span>
                      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14, textDecoration: "line-through" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "20px 28px" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  {/* 1 ferramenta */}
                  <a href={KIWIFY.basicTool} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12, padding: "14px 12px", textDecoration: "none", textAlign: "center",
                    display: "block",
                  }}>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                      1 ferramenta
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--white)", fontFamily: "serif" }}>
                      R$ 19<span style={{ fontSize: 14, fontWeight: 400 }}>,90</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--gold-light, #e2c47a)", marginTop: 8, fontWeight: 600 }}>
                      Comprar →
                    </div>
                  </a>
                  {/* Pacote */}
                  <a href={KIWIFY.basicPack} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 12, padding: "14px 12px", textDecoration: "none", textAlign: "center",
                    display: "block", position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                      background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)",
                      fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                      padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap",
                    }}>
                      Todas as 6
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                      Pacote completo
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--white)", fontFamily: "serif" }}>
                      R$ 109<span style={{ fontSize: 14, fontWeight: 400 }}>,90</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--gold-light, #e2c47a)", marginTop: 8, fontWeight: 600 }}>
                      Comprar →
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* ── Plus ── */}
            <div style={{
              background: "var(--white)", border: "2px solid var(--gold)",
              borderRadius: 20, overflow: "hidden", position: "relative",
            }}>
              {/* Top bar */}
              <div style={{ height: 4, background: "linear-gradient(90deg, var(--gold), #e2c47a, var(--gold))" }} />

              <div style={{ padding: "24px 28px 24px" }}>
                <div style={{
                  display: "inline-block", background: "var(--gold)",
                  color: "var(--navy)", fontSize: 11, fontWeight: 700,
                  letterSpacing: "1.5px", textTransform: "uppercase",
                  padding: "4px 12px", borderRadius: 20, marginBottom: 16,
                }}>
                  ✦ Plus — Recomendado
                </div>
                <h3 className="font-serif" style={{ fontSize: 24, color: "var(--navy)", margin: "0 0 12px" }}>
                  Ferramenta + IA + Plano de Ação
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.6, margin: "0 0 24px" }}>
                  Tudo do Basic, mais o Plano de Ação com IA: salve metas, acompanhe progresso e acesse de qualquer dispositivo.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
                  {[
                    "Formulário guiado com IA",
                    "Análise inteligente do problema",
                    "Sem necessidade de login",
                    "Acesso vitalício",
                    "Plano de ação salvo com IA",
                    "Histórico entre dispositivos",
                  ].map(f => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <span style={{ color: "#1a6b4a", fontSize: 14, fontWeight: 700 }}>✓</span>
                      <span style={{ color: "var(--text-main, #1a1a2e)", fontSize: 14 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", padding: "20px 28px" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  {/* 1 ferramenta */}
                  <a href={KIWIFY.plusTool} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1, background: "var(--cream)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "14px 12px", textDecoration: "none", textAlign: "center",
                    display: "block",
                  }}>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                      1 ferramenta
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", fontFamily: "serif" }}>
                      R$ 59<span style={{ fontSize: 14, fontWeight: 400 }}>,90</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--navy)", marginTop: 8, fontWeight: 600 }}>
                      Comprar →
                    </div>
                  </a>
                  {/* Pacote */}
                  <a href={KIWIFY.plusPack} target="_blank" rel="noopener noreferrer" style={{
                    flex: 1, background: "var(--gold)", border: "2px solid var(--gold)",
                    borderRadius: 12, padding: "14px 12px", textDecoration: "none", textAlign: "center",
                    display: "block", position: "relative",
                  }}>
                    <div style={{
                      position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                      background: "var(--navy)", color: "var(--gold-light, #e2c47a)",
                      fontSize: 10, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase",
                      padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap",
                    }}>
                      Melhor valor
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(13,27,42,0.6)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 4 }}>
                      Pacote completo
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: "var(--navy)", fontFamily: "serif" }}>
                      R$ 309<span style={{ fontSize: 14, fontWeight: 400 }}>,90</span>
                    </div>
                    <div style={{ fontSize: 12, color: "var(--navy)", marginTop: 8, fontWeight: 700 }}>
                      Comprar →
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Nota */}
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 13, marginTop: 24 }}>
            Acesso vitalício · Sem mensalidade · Pagamento único via Kiwify (cartão, Pix ou boleto)
          </p>
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
              { num: "2", title: "Acesse a ferramenta", desc: "Você recebe o link direto. Clique e já está dentro — sem senha." },
              { num: "3", title: "Use com IA", desc: "Preencha o formulário e clique em Analisar. A IA entrega o diagnóstico instantaneamente." },
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
        <h2 className="font-serif" style={{ fontSize: 30, color: "var(--navy)", marginBottom: 12 }}>
          Comece agora mesmo
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 15, maxWidth: 420, margin: "0 auto 32px" }}>
          Escolha uma ferramenta ou o pacote completo. Acesso imediato após o pagamento.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#precos" style={{
            display: "inline-flex", alignItems: "center",
            background: "var(--navy)", color: "var(--white)",
            borderRadius: 12, padding: "14px 32px",
            fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}>
            Ver planos →
          </a>
          <Link href="/dashboard" style={{
            display: "inline-flex", alignItems: "center",
            background: "transparent", color: "var(--text-muted)",
            border: "1px solid var(--border)", borderRadius: 12, padding: "14px 24px",
            fontSize: 14, textDecoration: "none",
          }}>
            Já comprei — acessar
          </Link>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--border)", textAlign: "center", padding: "24px 32px", color: "var(--text-muted)", fontSize: 13 }}>
        Hub de Melhoria Contínua · IA integrada para gestores hoteleiros
      </footer>
    </main>
  );
}
