"use client";

import { Plan } from "@/lib/types";
import { useState } from "react";
import Link from "next/link";
import { CheckoutBricks } from "./CheckoutBricks";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  const [email, setEmail] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const priceFormatted = (plan.price_brl / 100).toFixed(2).replace(".", ",");

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

      {/* Checkout Section */}
      {!showCheckout ? (
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            className="w-full px-3 py-2 border rounded text-sm"
            style={{ borderColor: "var(--border)" }}
          />
          <button
            onClick={() => setShowCheckout(email.length > 0)}
            disabled={email.length === 0}
            className="w-full py-2 px-4 rounded-lg font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: "var(--navy)" }}
          >
            Comprar Agora
          </button>
          <button
            onClick={() => {
              setShowCheckout(false);
              setEmail("");
            }}
            className="w-full py-2 px-4 rounded-lg font-semibold border text-sm"
            style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
          >
            Cancelar
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <CheckoutBricks
            planId={plan.id}
            email={email}
            planName={plan.name}
            price={plan.price_brl}
          />
          <button
            onClick={() => setShowCheckout(false)}
            className="w-full py-2 px-4 rounded-lg font-semibold border text-sm"
            style={{ borderColor: "var(--border)", color: "var(--text-main)" }}
          >
            Voltar
          </button>
        </div>
      )}

      {/* Footer */}
      <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>
        Pagamento seguro via{" "}
        <Link href="#" style={{ color: "var(--navy)", textDecoration: "underline" }}>
          Mercado Pago
        </Link>
      </p>
    </div>
  );
}
