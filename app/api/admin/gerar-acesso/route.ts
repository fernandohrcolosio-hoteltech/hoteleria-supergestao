import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";

// Rota protegida por secret key — apenas para uso interno/admin
export async function POST(request: NextRequest) {
  const { email, secret } = await request.json();

  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  if (!email) {
    return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
  }

  const supabase = await createClient();

  // Busca o plano completo (todos os tools)
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price_brl", { ascending: false });

  const plan = plans?.[0];
  if (!plan) {
    return NextResponse.json({ error: "Nenhum plano encontrado" }, { status: 404 });
  }

  const onboardingToken = crypto.randomBytes(32).toString("hex");

  const { data: purchase, error } = await supabase
    .from("purchases")
    .insert({
      plan_id: plan.id,
      email,
      mp_status: "approved",
      onboarding_token: onboardingToken,
    })
    .select()
    .single();

  if (error || !purchase) {
    return NextResponse.json({ error: "Erro ao criar acesso" }, { status: 500 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://hoteleria-supergestao.vercel.app";

  return NextResponse.json({
    email,
    plan: plan.name,
    tools: plan.tools,
    cadastroUrl: `${appUrl}/cadastro/${onboardingToken}`,
  });
}
