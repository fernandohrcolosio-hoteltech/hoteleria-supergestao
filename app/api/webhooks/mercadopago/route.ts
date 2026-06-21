import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendOnboardingEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Webhook do Mercado Pago
    if (body.type === "payment") {
      const paymentId = body.data.id;

      // Buscar detalhes do pagamento
      const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
      const paymentResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${mpAccessToken}`,
          },
        }
      );

      if (!paymentResponse.ok) {
        console.error("Erro ao buscar pagamento:", await paymentResponse.text());
        return NextResponse.json({ ok: false }, { status: 400 });
      }

      const payment = await paymentResponse.json();

      // Apenas processar pagamentos aprovados
      if (payment.status !== "approved") {
        console.log(`Pagamento ${paymentId} com status: ${payment.status}`);
        return NextResponse.json({ ok: true });
      }

      const supabase = await createClient();
      const externalReference = payment.external_reference;

      // Atualizar purchase com dados do pagamento
      const { data: purchase, error: fetchError } = await supabase
        .from("purchases")
        .select("*, plans(name)")
        .eq("id", externalReference)
        .single();

      if (fetchError || !purchase) {
        console.error("Purchase não encontrada:", externalReference);
        return NextResponse.json({ ok: false }, { status: 404 });
      }

      // Gerar token único de onboarding
      const onboardingToken = crypto.randomBytes(32).toString("hex");

      // Atualizar purchase
      const { error: updateError } = await supabase
        .from("purchases")
        .update({
          mp_payment_id: paymentId,
          mp_status: "approved",
          onboarding_token: onboardingToken,
        })
        .eq("id", purchase.id);

      if (updateError) {
        console.error("Erro ao atualizar purchase:", updateError);
        return NextResponse.json({ ok: false }, { status: 500 });
      }

      // Enviar email com token
      const planName = purchase.plans?.name || "Acesso Premium";
      await sendOnboardingEmail(purchase.email, onboardingToken, planName);

      console.log(`✅ Pagamento ${paymentId} processado e email enviado para ${purchase.email}`);
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
