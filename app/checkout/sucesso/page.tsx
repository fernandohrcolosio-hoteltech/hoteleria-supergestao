import Link from "next/link";

export default function CheckoutSucessoPage({
  searchParams,
}: {
  searchParams: { purchase_id?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">✅</div>

        <h1 className="text-3xl font-serif mb-4" style={{ color: "var(--navy)" }}>
          Pagamento Aprovado!
        </h1>

        <p className="mb-6" style={{ color: "var(--text-muted)" }}>
          Seu pagamento foi processado com sucesso. Você receberá um email em breve com o link para criar sua conta.
        </p>

        <div className="bg-white rounded-2xl p-6 border mb-6" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
            Não recebeu o email? Verifique sua pasta de spam ou entre em contato com o suporte.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "var(--navy)" }}
          >
            Voltar para Home
          </Link>

          <Link
            href="/login"
            className="inline-block w-full px-6 py-2 rounded-lg font-semibold border"
            style={{ borderColor: "var(--border)", color: "var(--navy)" }}
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </main>
  );
}
