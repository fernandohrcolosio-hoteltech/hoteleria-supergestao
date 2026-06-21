"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-js";

interface CheckoutBricksProps {
  planId: string;
  email: string;
  planName: string;
  price: number;
}

export function CheckoutBricks({ planId, email, planName, price }: CheckoutBricksProps) {
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "");
  }, []);

  useEffect(() => {
    async function createPreference() {
      try {
        setLoading(true);
        const response = await fetch("/api/checkout/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId, email }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Erro ao criar preferência");
          return;
        }

        setPreferenceId(data.preferenceId);
      } catch (err) {
        setError("Erro ao processar pagamento");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    createPreference();
  }, [planId, email]);

  if (loading) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        Carregando opções de pagamento...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded" style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}>
        {error}
      </div>
    );
  }

  if (!preferenceId) {
    return (
      <div className="text-center py-8" style={{ color: "var(--text-muted)" }}>
        Falha ao carregar o checkout
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="p-4 rounded border"
        style={{ backgroundColor: "#f9f9f9", borderColor: "var(--border)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--navy)" }}>
          {planName}
        </p>
        <p className="text-2xl font-serif mt-2" style={{ color: "var(--gold)" }}>
          R$ {(price / 100).toFixed(2)}
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>/mês</span>
        </p>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Email: {email}
        </p>
      </div>

      <Wallet initialization={{ preferenceId }} customization={{ texts: { valueProp: "Escolha a forma de pagamento" } }} />

      <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
        Pagamento seguro via Mercado Pago. Você será redirecionado após confirmar.
      </p>
    </div>
  );
}
