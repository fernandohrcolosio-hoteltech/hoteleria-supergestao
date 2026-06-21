"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function CadastroPage({ params }: { params: { token: string } }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const supabase = createClient();

      // Validar token
      const { data: purchase, error: purchaseError } = await supabase
        .from("purchases")
        .select("id, email, plan_id, plans(tools)")
        .eq("onboarding_token", params.token)
        .eq("token_used", false)
        .single();

      if (purchaseError || !purchase) {
        setError("Token inválido ou expirado");
        setLoading(false);
        return;
      }

      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: purchase.email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (!authData.user) {
        setError("Erro ao criar conta");
        setLoading(false);
        return;
      }

      // Criar acesso às ferramentas
      const tools = purchase.plans?.tools || [];
      for (const tool of tools) {
        await supabase.from("user_tool_access").insert({
          user_id: authData.user.id,
          tool_slug: tool,
          purchase_id: purchase.id,
        });
      }

      // Marcar token como usado
      await supabase
        .from("purchases")
        .update({ token_used: true })
        .eq("id", purchase.id);

      // Fazer login automático
      await supabase.auth.signInWithPassword({
        email: purchase.email,
        password,
      });

      router.push("/dashboard");
    } catch (err) {
      setError("Erro ao criar conta. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4" style={{ backgroundColor: "var(--cream)" }}>
      <div
        className="rounded-lg p-8 shadow-sm border max-w-md w-full"
        style={{ backgroundColor: "var(--white)", borderColor: "var(--border)" }}
      >
        <h1 className="text-2xl font-serif mb-2" style={{ color: "var(--navy)" }}>
          Criar Conta
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          Complete seu cadastro para acessar as ferramentas
        </p>

        <form onSubmit={handleCadastro} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--text-main)" }}>
              Email
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full px-3 py-2 border rounded text-sm bg-gray-100"
              style={{ borderColor: "var(--border)" }}
            />
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
              Email verificado do pagamento
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1" style={{ color: "var(--text-main)" }}>
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-sm"
              style={{ borderColor: "var(--border)" }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-xs p-2 rounded" style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--navy)" }}
          >
            {loading ? "Criando conta..." : "Acessar Ferramentas"}
          </button>
        </form>
      </div>
    </main>
  );
}
