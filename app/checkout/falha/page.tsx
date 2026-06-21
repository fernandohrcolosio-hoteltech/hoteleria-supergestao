import Link from "next/link";

export default function CheckoutFalhaPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">❌</div>

        <h1 className="text-3xl font-serif mb-4" style={{ color: "var(--navy)" }}>
          Pagamento Recusado
        </h1>

        <p className="mb-6" style={{ color: "var(--text-muted)" }}>
          Infelizmente seu pagamento foi recusado. Verifique os dados e tente novamente, ou use outro método de pagamento.
        </p>

        <div className="bg-white rounded-2xl p-6 border mb-6" style={{ borderColor: "var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Possíveis motivos:
          </p>
          <ul className="text-sm mt-2 space-y-1" style={{ color: "var(--text-main)" }}>
            <li>• Saldo insuficiente</li>
            <li>• Dados do cartão incorretos</li>
            <li>• Limite excedido</li>
            <li>• Transação bloqueada pelo banco</li>
          </ul>
        </div>

        <div className="space-y-3">
          <Link
            href="/"
            className="inline-block w-full px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "var(--navy)" }}
          >
            Tentar Novamente
          </Link>

          <Link
            href="/"
            className="inline-block w-full px-6 py-2 rounded-lg font-semibold border"
            style={{ borderColor: "var(--border)", color: "var(--navy)" }}
          >
            Voltar para Home
          </Link>
        </div>
      </div>
    </main>
  );
}
