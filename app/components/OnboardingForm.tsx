"use client";

import { useState } from "react";
import { completeOnboarding } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

interface OnboardingFormProps {
  token: string;
  email: string;
}

export function OnboardingForm({ token, email }: OnboardingFormProps) {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    const { error: resultError } = await completeOnboarding(
      token,
      email,
      password,
      fullName
    );

    if (resultError) {
      setError(resultError);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
          Nome Completo
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="Seu nome"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-2 border rounded-lg bg-gray-100"
          style={{ borderColor: "var(--border)" }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Email do pagamento — não pode ser alterado
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
          Criar Senha
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
          Confirmar Senha
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <div className="p-3 rounded text-sm" style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 rounded-lg font-semibold text-white transition-all disabled:opacity-50"
        style={{ backgroundColor: "var(--navy)" }}
      >
        {loading ? "Criando conta..." : "Criar Conta e Acessar"}
      </button>
    </form>
  );
}
