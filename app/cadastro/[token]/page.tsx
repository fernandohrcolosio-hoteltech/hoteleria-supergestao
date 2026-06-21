import { validateOnboardingToken } from "@/app/actions/auth";
import { OnboardingForm } from "@/app/components/OnboardingForm";
import Link from "next/link";

interface CadastroPageProps {
  params: Promise<{ token: string }>;
}

export default async function CadastroPage({ params }: CadastroPageProps) {
  const { token } = await params;
  const { purchase, error } = await validateOnboardingToken(token);

  if (error || !purchase) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
        <div className="w-full max-w-md text-center">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-2xl font-serif mb-4" style={{ color: "var(--navy)" }}>
            Link Inválido
          </h1>
          <p className="mb-6" style={{ color: "var(--text-muted)" }}>
            {error || "Este link de cadastro não é válido ou já foi utilizado."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: "var(--navy)" }}
          >
            Voltar para Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-serif mb-2" style={{ color: "var(--navy)" }}>
            Bem-vindo!
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Seu pagamento foi aprovado. Crie sua conta para acessar.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md border" style={{ borderColor: "var(--border)" }}>
          <OnboardingForm token={token} email={purchase.email} />
        </div>
      </div>
    </main>
  );
}
