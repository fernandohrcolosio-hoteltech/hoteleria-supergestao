import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SLUGS = ["ishikawa", "porques", "smart", "eisenhower", "5s", "pdca"];

export async function POST(request: NextRequest) {
  const tool = new URL(request.url).searchParams.get("tool");
  if (!tool || !SLUGS.includes(tool)) {
    return NextResponse.json({ error: "Ferramenta inválida." }, { status: 400 });
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
    // Ignorar outros eventos silenciosamente
    return NextResponse.json({ ok: true, ignored: true });
  }

  // Extrai order_id de diferentes formatos possíveis do Kiwify
  const data = payload?.data as Record<string, unknown> | undefined;
  const orderId = (data?.id ?? payload?.order_id ?? payload?.id) as string | undefined;

  if (!orderId) {
    return NextResponse.json({ error: "order_id não encontrado." }, { status: 400 });
  }

  const supabase = await createClient();

  // Upsert para tolerar webhooks duplicados
  const { error } = await supabase
    .from("plus_licenses")
    .upsert(
      { code: String(orderId), tool_slug: tool },
      { onConflict: "code" }
    );

  if (error) {
    console.error("Supabase error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
