"use client";

import { useState } from "react";

interface PayPalCheckoutProps {
  planId: string;
  email: string;
  planName: string;
  price: number;
}

export function PayPalCheckout({ planId, email, planName, price }: PayPalCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar pedido");
        return;
      }

      window.location.href = data.approvalUrl;
    } catch {
      setError("Erro ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <div
        className="p-3 rounded border text-sm"
        style={{ backgroundColor: "#f9f9f9", borderColor: "var(--border)" }}
      >
        <p className="font-semibold" style={{ color: "var(--navy)" }}>
          {planName}
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Email: {email}
        </p>
        <p className="text-lg font-serif mt-1" style={{ color: "var(--gold)" }}>
          R$ {(price / 100).toFixed(2).replace(".", ",")}/mês
        </p>
      </div>

      {error && (
        <div
          className="p-3 rounded text-xs"
          style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg font-bold text-white disabled:opacity-60"
        style={{ backgroundColor: "#0070BA", fontSize: "15px" }}
      >
        {loading ? "Aguarde..." : "Pagar com PayPal"}
      </button>
    </div>
  );
}
