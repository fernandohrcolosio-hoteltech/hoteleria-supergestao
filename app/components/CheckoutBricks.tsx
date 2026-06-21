"use client";

import { useEffect, useState } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

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
    const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "";
    initMercadoPago(publicKey, { locale: "pt-BR" });
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
      } catch {
        setError("Erro ao processar pagamento");
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
      <div className="p-4 rounded text-xs" style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}>
        {error}
      </div>
    );
  }

  if (!preferenceId) return null;

  return (
    <div className="space-y-3">
      <div className="p-3 rounded border text-sm" style={{ backgroundColor: "#f9f9f9", borderColor: "var(--border)" }}>
        <p className="font-semibold" style={{ color: "var(--navy)" }}>{planName}</p>
        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Email: {email}</p>
        <p className="text-lg font-serif mt-1" style={{ color: "var(--gold)" }}>
          R$ {(price / 100).toFixed(2).replace(".", ",")}/mês
        </p>
      </div>

      <Wallet
        initialization={{ preferenceId, redirectMode: "modal" }}
        customization={{ texts: { valueProp: "smart_option" } }}
      />
    </div>
  );
}
