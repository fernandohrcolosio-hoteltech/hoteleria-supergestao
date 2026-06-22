import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const SENTINEL = "__actions__";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "anonymous";
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) return NextResponse.json({ actions: [] });

  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_entries")
    .select("data")
    .eq("user_id", sessionId)
    .eq("tool_slug", slug)
    .eq("name", SENTINEL)
    .maybeSingle();

  return NextResponse.json({ actions: (data?.data as Record<string, unknown>)?.actions || [] });
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "anonymous";
  const { slug, actions } = await request.json();

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("tool_entries")
    .select("id")
    .eq("user_id", sessionId)
    .eq("tool_slug", slug)
    .eq("name", SENTINEL)
    .maybeSingle();

  if (existing?.id) {
    await supabase
      .from("tool_entries")
      .update({ data: { actions }, updated_at: new Date().toISOString() })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("tool_entries")
      .insert({ user_id: sessionId, tool_slug: slug, name: SENTINEL, data: { actions } });
  }

  return NextResponse.json({ ok: true });
}
