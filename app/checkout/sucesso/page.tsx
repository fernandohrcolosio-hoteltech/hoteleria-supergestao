"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Status = "loading" | "success" | "error";

function CheckoutSucessoContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    const purchaseId = searchParams.get("purchase_id");

    if (!token || !purchaseId) {
      setStatus("error");
      setErrorMsg("Parâmetros de pagamento não encontrados.");
      return;
    }

    fetch("/api/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: token, purchaseId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(data.error || "Erro ao confirmar pagamento.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMsg("Erro ao conectar com o servidor.");
      });
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="text-5xl mb-4">⏳</div>
        <p className="text-lg" style={{ color: "var(--navy)" }}>Confirmando seu pagamento...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-6">❌</div>
        <h1 className="text-3xl font-serif mb-4" style={{ color: "var(--navy)" }}>
          Algo deu errado
        </h1>
        <p className="mb-6" style={{ color: "var(--text-muted)" }}>{errorMsg}</p>
        <Link
          href="/"
          className="inline-block w-full px-6 py-2 rounded-lg text-white font-semibold"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Voltar para Home
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-serif mb-4" style={{ color: "var(--navy)" }}>
        Pagamento Aprovado!
      </h1>
      <p className="mb-6" style={{ color: "var(--text-muted)" }}>
        Verifique seu email — enviamos o link para criar sua conta e acessar as ferramentas.
      </p>
      <div className="bg-white rounded-2xl p-6 border mb-6" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Não recebeu? Verifique a pasta de spam ou entre em contato com o suporte.
        </p>
      </div>
      <div className="space-y-3">
        <Link
          href="/"
          className="inline-block w-full px-6 py-2 rounded-lg text-white font-semibold"
          style={{ backgroundColor: "var(--navy)" }}
        >
          Voltar para Home
        </Link>
        <Link
          href="/login"
          className="inline-block w-full px-6 py-2 rounded-lg font-semibold border"
          style={{ borderColor: "var(--border)", color: "var(--navy)" }}
        >
          Fazer Login
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSucessoPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--cream)" }}
    >
      <Suspense
        fallback={
          <div className="text-center">
            <div className="text-5xl mb-4">⏳</div>
            <p className="text-lg" style={{ color: "var(--navy)" }}>Carregando...</p>
          </div>
        }
      >
        <CheckoutSucessoContent />
      </Suspense>
    </main>
  );
}
