import Link from "next/link";

export default function CheckoutPendentePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">⏳</div>

        <h1 className="text-3xl font-serif mb-4" style={{ color: "var(--navy)" }}>
          Pagamento Pendente
        </h1>

        <p className="mb-6" style={{ color: "var(--text-muted)" }}>
          Seu pagamento está sendo processado. Isso pode levar alguns minutos. Você receberá um email quando for confirmado.
        </p>

        <div className="bg-white rounded-2xl p-6 border mb-6" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: "var(--navy)" }}>
            Se você pagou com PIX:
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            O comprovante pode levar até 2 horas para chegar. Não feche esta página ainda.
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
