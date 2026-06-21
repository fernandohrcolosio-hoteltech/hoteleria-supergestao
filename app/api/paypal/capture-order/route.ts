import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendOnboardingEmail } from "@/lib/email";

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
    const { orderId, purchaseId } = await request.json();

    const token = await getPayPalToken();

    const captureRes = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const capture = await captureRes.json();

    if (!captureRes.ok || capture.status !== "COMPLETED") {
      console.error("Capture error:", capture);
      return NextResponse.json({ error: "Pagamento não confirmado" }, { status: 400 });
    }

    const supabase = await createClient();
    const onboardingToken = crypto.randomBytes(32).toString("hex");

    const { data: purchase } = await supabase
      .from("purchases")
      .update({
        mp_payment_id: orderId,
        mp_status: "approved",
        onboarding_token: onboardingToken,
      })
      .eq("id", purchaseId)
      .select("*, plans(name)")
      .single();

    if (!purchase) {
      return NextResponse.json({ error: "Compra não encontrada" }, { status: 404 });
    }

    const planName = (purchase.plans as { name: string })?.name || "Acesso Premium";
    await sendOnboardingEmail(purchase.email, onboardingToken, planName);

    return NextResponse.json({ ok: true, purchaseId });
  } catch (error) {
    console.error("Capture error:", error);
    return NextResponse.json({ error: "Erro ao capturar pagamento" }, { status: 500 });
  }
}
