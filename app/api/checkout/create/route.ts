import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { planId, email } = await request.json();

    if (!planId || !email) {
      return NextResponse.json(
        { error: "planId e email são obrigatórios" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("id", planId)
      .single();

    if (planError || !plan) {
      return NextResponse.json({ error: "Plano não encontrado" }, { status: 404 });
    }

    // Create purchase record
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        plan_id: planId,
        email,
        mp_status: "pending",
      })
      .select()
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: "Erro ao criar compra" },
        { status: 500 }
      );
    }

    // Create Mercado Pago preference
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!mpAccessToken) {
      return NextResponse.json(
        { error: "Mercado Pago não configurado" },
        { status: 500 }
      );
    }

    const unitPrice = plan.price_brl / 100;

    const preferenceData = {
      transaction_amount: unitPrice,
      items: [
        {
          id: plan.id,
          title: plan.name,
          description: `Acesso a ${plan.tools.length} ferramenta(s): ${plan.tools.join(", ")}`,
          quantity: 1,
          unit_price: unitPrice,
          currency_id: "BRL",
        },
      ],
      payer: {
        email,
      },
      payment_methods: {
        excluded_payment_types: [
          { id: "bank_transfer" }
        ],
        installments: 1,
      },
      processing_modes: ["aggregator"],
      external_reference: purchase.id,
      notification_url: `${appUrl}/api/webhooks/mercadopago`,
      back_urls: {
        success: `${appUrl}/checkout/sucesso?purchase_id=${purchase.id}`,
        failure: `${appUrl}/checkout/falha?purchase_id=${purchase.id}`,
        pending: `${appUrl}/checkout/pendente?purchase_id=${purchase.id}`,
      },
      auto_return: "approved",
    };

    const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mpAccessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceData),
    });

    if (!mpResponse.ok) {
      console.error("Mercado Pago error:", await mpResponse.text());
      return NextResponse.json(
        { error: "Erro ao criar preference no Mercado Pago" },
        { status: 500 }
      );
    }

    const preference = await mpResponse.json();

    // Save preference ID
    const { error: updateError } = await supabase
      .from("purchases")
      .update({ mp_preference_id: preference.id })
      .eq("id", purchase.id);

    if (updateError) {
      console.error("Error updating purchase:", updateError);
    }

    return NextResponse.json({
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
      preferenceId: preference.id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Erro ao processar checkout" },
      { status: 500 }
    );
  }
}
