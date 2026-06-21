"use client";

import { useState } from "react";
import { signIn } from "@/app/actions/auth";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Tente novamente."
      );
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-lg"
          style={{ borderColor: "var(--border)" }}
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-main)" }}>
          Senha
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
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm" style={{ color: "var(--text-muted)" }}>
        Não tem conta?{" "}
        <Link href="/recuperar-senha" className="underline" style={{ color: "var(--navy)" }}>
          Recuperar senha
        </Link>
      </p>
    </form>
  );
}
