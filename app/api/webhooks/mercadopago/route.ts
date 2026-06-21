import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    // Verify signature if secret is configured
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = request.headers.get("x-signature") || "";
      const requestId = request.headers.get("x-request-id") || "";

      const parts = signature.split(",");
      const ts = parts[0]?.split("=")[1];
      const hash = parts[1]?.split("=")[1];

      if (ts && hash) {
        const payload = `${requestId}.${ts}.${JSON.stringify(data)}`;
        const computed = crypto
          .createHmac("sha256", webhookSecret)
          .update(payload)
          .digest("hex");

        if (computed !== hash) {
          console.warn("Invalid signature received");
          return NextResponse.json({ received: true });
        }
      }
    }

    // Only process payment notifications
    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = data.id;

    // Get payment details from Mercado Pago
    const mpAccessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!mpAccessToken) {
      console.error("Mercado Pago token not configured");
      return NextResponse.json({ received: true });
    }

    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${mpAccessToken}`,
        },
      }
    );

    if (!mpResponse.ok) {
      console.error("Error fetching payment from MP:", await mpResponse.text());
      return NextResponse.json({ received: true });
    }

    const payment = await mpResponse.json();
    const externalReference = payment.external_reference;

    if (!externalReference) {
      console.warn("No external_reference in payment");
      return NextResponse.json({ received: true });
    }

    const supabase = await createClient();

    // Find purchase by ID
    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", externalReference)
      .single();

    if (purchaseError || !purchase) {
      console.warn("Purchase not found:", externalReference);
      return NextResponse.json({ received: true });
    }

    // Map MP status to our status
    let newStatus = "pending";
    if (payment.status === "approved") {
      newStatus = "approved";
    } else if (payment.status === "rejected") {
      newStatus = "rejected";
    } else if (payment.status === "cancelled") {
      newStatus = "cancelled";
    }

    // Update purchase with payment details
    const { error: updateError } = await supabase
      .from("purchases")
      .update({
        mp_payment_id: paymentId,
        mp_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchase.id);

    if (updateError) {
      console.error("Error updating purchase:", updateError);
      return NextResponse.json({ received: true });
    }

    // If approved, send onboarding email
    if (newStatus === "approved") {
      // Generate onboarding token if not already generated
      if (!purchase.onboarding_token) {
        const token = crypto.randomUUID();

        const { error: tokenError } = await supabase
          .from("purchases")
          .update({ onboarding_token: token })
          .eq("id", purchase.id);

        if (!tokenError) {
          // Send email (implement based on your email service)
          await sendOnboardingEmail(purchase.email, token);
        }
      } else if (!purchase.token_used) {
        // Token already exists, resend email if needed
        await sendOnboardingEmail(purchase.email, purchase.onboarding_token);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}

async function sendOnboardingEmail(email: string, token: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const onboardingUrl = `${appUrl}/cadastro/${token}`;

  // TODO: Implement actual email sending (Resend, SendGrid, etc.)
  // For now, just log it
  console.log(`
    📧 Sending onboarding email
    To: ${email}
    Link: ${onboardingUrl}
  `);

  // Example with Resend (uncomment when configured):
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "noreply@melhoria-continua.com",
  //   to: email,
  //   subject: "Bem-vindo! Crie sua conta",
  //   html: `<a href="${onboardingUrl}">Clique aqui para criar sua conta</a>`,
  // });
}
