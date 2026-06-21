"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "./auth";

export async function createToolEntry(
  toolSlug: string,
  name: string,
  data: Record<string, unknown>
) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("tool_entries")
    .insert({
      user_id: user.id,
      tool_slug: toolSlug,
      name,
      data,
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { entry };
}

export async function updateToolEntry(
  entryId: string,
  data: Record<string, unknown>,
  aiAnalysis?: string
) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("tool_entries")
    .update({
      data,
      ai_analysis: aiAnalysis,
      updated_at: new Date().toISOString(),
    })
    .eq("id", entryId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return { error: error.message };
  return { entry };
}

export async function getToolEntry(entryId: string) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("tool_entries")
    .select("*")
    .eq("id", entryId)
    .eq("user_id", user.id)
    .single();

  if (error) return { error: error.message };
  return { entry };
}

export async function listToolEntries(toolSlug: string) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const supabase = await createClient();

  const { data: entries, error } = await supabase
    .from("tool_entries")
    .select("id, name, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("tool_slug", toolSlug)
    .order("updated_at", { ascending: false });

  if (error) return { error: error.message };
  return { entries };
}

export async function deleteToolEntry(entryId: string) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const supabase = await createClient();

  const { error } = await supabase
    .from("tool_entries")
    .delete()
    .eq("id", entryId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}
