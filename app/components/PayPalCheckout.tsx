"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useState } from "react";

interface PayPalCheckoutProps {
  planId: string;
  email: string;
  planName: string;
  price: number;
}

export function PayPalCheckout({ planId, email, planName, price }: PayPalCheckoutProps) {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

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

      {success ? (
        <div className="p-4 rounded text-sm text-center" style={{ backgroundColor: "#e8f5e9", color: "#2e7d32" }}>
          <p className="font-semibold">Pagamento confirmado!</p>
          <p className="text-xs mt-1">Verifique seu email para criar sua conta.</p>
        </div>
      ) : (
        <>
          {error && (
            <div
              className="p-3 rounded text-xs"
              style={{ backgroundColor: "#fde8e8", color: "#c0392b" }}
            >
              {error}
            </div>
          )}

          <PayPalScriptProvider
            options={{
              clientId,
              currency: "BRL",
              intent: "capture",
            }}
          >
            <PayPalButtons
              style={{ layout: "vertical", color: "gold", shape: "rect", label: "pay" }}
              createOrder={async () => {
                setError("");
                const res = await fetch("/api/paypal/create-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ planId, email }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.error || "Erro ao criar pedido");
                  throw new Error(data.error);
                }
                sessionStorage.setItem("paypal_purchase_id", data.purchaseId);
                return data.orderId;
              }}
              onApprove={async (data) => {
                const purchaseId = sessionStorage.getItem("paypal_purchase_id");
                const res = await fetch("/api/paypal/capture-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ orderId: data.orderID, purchaseId }),
                });
                const result = await res.json();
                if (!res.ok) {
                  setError(result.error || "Erro ao confirmar pagamento");
                  return;
                }
                sessionStorage.removeItem("paypal_purchase_id");
                setSuccess(true);
              }}
              onError={() => {
                setError("Erro no pagamento. Tente novamente.");
              }}
              onCancel={() => {
                setError("Pagamento cancelado.");
              }}
            />
          </PayPalScriptProvider>
        </>
      )}
    </div>
  );
}
