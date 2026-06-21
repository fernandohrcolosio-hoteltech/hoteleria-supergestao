import { LoginForm } from "@/app/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: "var(--cream)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-2" style={{ color: "var(--navy)" }}>
            Entrar
          </h1>
          <p style={{ color: "var(--text-muted)" }}>
            Acesse suas ferramentas de melhoria contínua
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md border" style={{ borderColor: "var(--border)" }}>
          <LoginForm />
        </div>

        <p className="text-center text-sm mt-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="underline" style={{ color: "var(--navy)" }}>
            ← Voltar para home
          </Link>
        </p>
      </div>
    </main>
  );
}
