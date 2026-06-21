import Link from "next/link";

export default function RecuperarSenhaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2" style={{ color: "var(--navy)" }}>
            Recuperar Senha
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Funcionalidade em desenvolvimento
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md border" style={{ borderColor: "var(--border)" }}>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            A recuperação de senha será implementada em breve. Por enquanto, entre em contato com o suporte.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "var(--navy)" }}
          >
            Voltar para Login
          </Link>
        </div>
      </div>
    </main>
  );
}
