"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error || !data.user) {
    return { error: error?.message || "Erro ao criar conta" };
  }

  // Create profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  return { user: data.user };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function getUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

export async function validateOnboardingToken(token: string) {
  const supabase = await createClient();

  const { data: purchase, error } = await supabase
    .from("purchases")
    .select("id, plan_id, email, mp_status, token_used")
    .eq("onboarding_token", token)
    .single();

  if (error || !purchase) {
    return { error: "Token inválido ou expirado" };
  }

  if (purchase.mp_status !== "approved") {
    return { error: "Pagamento não foi aprovado" };
  }

  if (purchase.token_used) {
    return { error: "Este token já foi utilizado" };
  }

  return { purchase };
}

export async function completeOnboarding(
  token: string,
  email: string,
  password: string,
  fullName: string
) {
  const supabase = await createClient();

  // Validate token first
  const { data: purchase, error: tokenError } = await supabase
    .from("purchases")
    .select("id, plan_id, email, mp_status, token_used")
    .eq("onboarding_token", token)
    .single();

  if (tokenError || !purchase) {
    return { error: "Token inválido" };
  }

  if (purchase.mp_status !== "approved" || purchase.token_used) {
    return { error: "Token já foi utilizado ou pagamento não aprovado" };
  }

  // Create user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (signUpError || !authData.user) {
    return { error: signUpError?.message || "Erro ao criar conta" };
  }

  const userId = authData.user.id;

  // Create profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: fullName,
  });

  if (profileError) {
    return { error: profileError.message };
  }

  // Get plan tools
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("tools")
    .eq("id", purchase.plan_id)
    .single();

  if (planError || !plan) {
    return { error: "Erro ao recuperar plano" };
  }

  // Grant access to tools
  const toolAccessInserts = plan.tools.map((tool: string) => ({
    user_id: userId,
    tool_slug: tool,
    purchase_id: purchase.id,
  }));

  const { error: accessError } = await supabase
    .from("user_tool_access")
    .insert(toolAccessInserts);

  if (accessError) {
    return { error: accessError.message };
  }

  // Mark token as used
  const { error: updateError } = await supabase
    .from("purchases")
    .update({ token_used: true })
    .eq("id", purchase.id);

  if (updateError) {
    return { error: updateError.message };
  }

  return { user: authData.user };
}
