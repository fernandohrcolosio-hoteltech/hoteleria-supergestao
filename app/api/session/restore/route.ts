import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { code } = await request.json();
  const clean = (code || "").trim();
  if (!clean || clean.length < 8) {
    return NextResponse.json({ error: "Código inválido." }, { status: 400 });
  }

  const supabase = await createClient();

  // Verifica se existem dados salvos com esse código
  const { count } = await supabase
    .from("tool_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", clean);

  if (!count || count === 0) {
    return NextResponse.json({ error: "Nenhum dado encontrado para este código." }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("session_id", clean, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return response;
}
