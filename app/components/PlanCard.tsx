"use client";

import { Plan } from "@/lib/types";
import { useState } from "react";
import Link from "next/link";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const priceFormatted = (plan.price_brl / 100).toFixed(2).replace(".", ",");

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Erro ao processar checkout");
        setLoading(false);
        return;
      }

      // Redirect to Mercado Pago
      const checkoutUrl = data.initPoint || data.sandboxInitPoint;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        setError("Erro ao redirecionar para o pagamento");
        setLoading(false);
      }
    } catch (err) {
      setError("Erro ao processar checkout");
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-radius-lg p-7 border flex flex-col"
      style={{
        backgroundColor: "var(--white)",
        borderColor: "var(--border)",
      }}
    >
      {/* Badge */}
      <div
        className="inline-block text-xs font-semibold mb-3 px-3 py-1 rounded-full w-fit"
        style={{ backgroundColor: "var(--gold-pale)", color: "#7a5c1e" }}
      >
        {plan.type === "avulso" ? "AVULSO" : "PACOTE"}
      </div>

      {/* Title */}
      <h3 className="text-xl font-serif mb-3 flex-1" style={{ color: "var(--navy)" }}>
        {plan.name}
      </h3>

      {/* Tools list */}
      <div className="mb-6">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-muted)" }}>
          Inclui:
        </p>
        <ul className="space-y-1">
          {plan.tools.map((tool) => (
            <li key={tool} className="text-sm" style={{ color: "var(--text-main)" }}>
              ✓ {tool}
            </li>
          ))}
        </ul>
      </div>

      {/* Price */}
      <div className="mb-6 pb-6 border-t" style={{ borderColor: "var(--border)" }}>
        <p className="text-3xl font-serif mt-4" style={{ color: "var(--gold)" }}>
          R$ {priceFormatted}
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>/mês</span>
        </p>
      </div>

      {/* CTA Button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 px-4 rounded-lg font-semibold text-white transition-all"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Comprar Agora
        </button>
      ) : (
        <form onSubmit={handleCheckout} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-main)" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded text-sm"
              style={{ borderColor: "var(--border)" }}
              placeholder="seu@email.com"
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
            style={{ backgroundColor: "var(--gold)" }}
          >
            {loading ? "Processando..." : "Ir para Pagamento"}
          </button>

          <button
            type="button"
            onClick={() => {
              setShowForm(false);
              setEmail("");
              setError("");
            }}
            className="w-full py-2 px-4 rounded-lg font-semibold border"
            style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
        Pagamento via{" "}
        <Link href="#" style={{ color: "var(--navy)", textDecoration: "underline" }}>
          Mercado Pago
        </Link>
      </p>
    </div>
  );
}
