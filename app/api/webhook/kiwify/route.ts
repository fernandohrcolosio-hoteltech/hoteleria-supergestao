import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SLUGS = ["ishikawa", "porques", "smart", "eisenhower", "5s", "pdca"];

const TOKENS: Record<string, string | undefined> = {
  ishikawa:   process.env.KIWIFY_TOKEN_ISHIKAWA,
  porques:    process.env.KIWIFY_TOKEN_PORQUES,
  smart:      process.env.KIWIFY_TOKEN_SMART,
  eisenhower: process.env.KIWIFY_TOKEN_EISENHOWER,
  "5s":       process.env.KIWIFY_TOKEN_5S,
  pdca:       process.env.KIWIFY_TOKEN_PDCA,
};

export async function POST(request: NextRequest) {
  const tool = new URL(request.url).searchParams.get("tool");
  if (!tool || !SLUGS.includes(tool)) {
    return NextResponse.json({ error: "Ferramenta inválida." }, { status: 400 });
  }

  // Valida token do Kiwify (enviado no header Authorization: Bearer TOKEN)
  const expectedToken = TOKENS[tool];
  if (expectedToken) {
    const authHeader = request.headers.get("authorization") || "";
    const receivedToken = authHeader.replace("Bearer ", "").trim();
    if (receivedToken !== expectedToken) {
      return NextResponse.json({ error: "Token inválido." }, { status: 401 });
    }
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  // Kiwify envia: { event: "order.approved", data: { id, status, ... } }
  const event = payload?.event as string | undefined;
  if (event && event !== "order.approved") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Extrai order_id de diferentes formatos possíveis do Kiwify
  const data = payload?.data as Record<string, unknown> | undefined;
  const orderId = (data?.id ?? payload?.order_id ?? payload?.id) as string | undefined;

  if (!orderId) {
    return NextResponse.json({ error: "order_id não encontrado." }, { status: 400 });
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("plus_licenses")
    .upsert(
      { code: String(orderId), tool_slug: tool },
      { onConflict: "code" }
    );

  if (error) {
    console.error("Supabase webhook error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
