import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function getPayPalToken() {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;
  const base64 = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${base64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const { planId, email } = await request.json();

    if (!planId || !email) {
      return NextResponse.json({ error: "planId e email obrigatórios" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data: plan } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (!plan) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
    }

    const { data: purchase } = await supabase
      .from("purchases")
      .insert({ plan_id: planId, email, mp_status: "pending" })
      .select()
      .single();

    if (!purchase) {
      return NextResponse.json({ error: "Erro ao criar compra" }, { status: 500 });
    }

    const token = await getPayPalToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    const unitPrice = (plan.price_brl / 100).toFixed(2);

    const orderRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: purchase.id,
            description: plan.name,
            amount: {
              currency_code: "BRL",
              value: unitPrice,
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
              brand_name: "Hub de Melhoria Contínua",
              locale: "pt-BR",
              landing_page: "LOGIN",
              user_action: "PAY_NOW",
              return_url: `${appUrl}/checkout/sucesso?purchase_id=${purchase.id}`,
              cancel_url: `${appUrl}/checkout/falha?purchase_id=${purchase.id}`,
            },
          },
        },
      }),
    });

    const order = await orderRes.json();

    if (!orderRes.ok) {
      console.error("PayPal error:", order);
      return NextResponse.json({ error: "Erro ao criar pedido PayPal" }, { status: 500 });
    }

    await supabase
      .from("purchases")
      .update({ mp_preference_id: order.id })
      .eq("id", purchase.id);

    return NextResponse.json({
      orderId: order.id,
      purchaseId: purchase.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erro ao processar checkout" }, { status: 500 });
  }
}
