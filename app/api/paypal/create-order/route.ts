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

  if (!data.access_token) {
    console.error("PayPal token error:", data);
    throw new Error("Falha ao obter token PayPal");
  }

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

    const accessToken = await getPayPalToken();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hoteleria-supergestao.vercel.app";
    const unitPrice = (plan.price_brl / 100).toFixed(2);

    const orderBody = {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: purchase.id,
          description: plan.name,
          amount: {
            currency_code: "USD",
            value: unitPrice,
          },
        },
      ],
      application_context: {
        brand_name: "Hub de Melhoria Contínua",
        locale: "pt-BR",
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        return_url: `${appUrl}/checkout/sucesso?purchase_id=${purchase.id}`,
        cancel_url: `${appUrl}/checkout/falha?purchase_id=${purchase.id}`,
      },
    };

    const orderRes = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    });

    const order = await orderRes.json();

    if (!orderRes.ok) {
      console.error("PayPal order error:", JSON.stringify(order));
      return NextResponse.json({ error: "Erro ao criar pedido PayPal", detail: order }, { status: 500 });
    }

    await supabase
      .from("purchases")
      .update({ mp_preference_id: order.id })
      .eq("id", purchase.id);

    const approvalLink = order.links?.find(
      (l: { rel: string; href: string }) => l.rel === "approve"
    );

    if (!approvalLink) {
      console.error("No approve link:", order);
      return NextResponse.json({ error: "Link de pagamento não encontrado" }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      purchaseId: purchase.id,
      approvalUrl: approvalLink.href,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erro ao processar checkout" }, { status: 500 });
  }
}
