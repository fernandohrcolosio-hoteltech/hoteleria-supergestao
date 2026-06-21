"use server";

import { createClient } from "@/lib/supabase/server";

export async function initiateCheckout(planId: string, email: string) {
  const supabase = await createClient();

  // Get plan details
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("*")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    return { error: "Plano não encontrado" };
  }

  // Create purchase record (pending)
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
    return { error: "Erro ao criar purchase" };
  }

  // TODO: Call Mercado Pago API to create preference
  // For now, return placeholder

  return {
    purchase,
    preferenceUrl: null, // Will be filled in Etapa 5
  };
}
