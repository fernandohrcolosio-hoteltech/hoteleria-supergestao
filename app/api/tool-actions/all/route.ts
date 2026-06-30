import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

const SENTINEL = "__actions__";
const SLUGS = ["ishikawa", "porques", "smart", "eisenhower", "5s", "pdca"];

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || "anonymous";

  const supabase = await createClient();
  const { data } = await supabase
    .from("tool_entries")
    .select("tool_slug, data")
    .eq("user_id", sessionId)
    .eq("name", SENTINEL)
    .in("tool_slug", SLUGS);

  const result: Record<string, unknown[]> = {};
  for (const slug of SLUGS) {
    const row = data?.find(r => r.tool_slug === slug);
    result[slug] = (row?.data as Record<string, unknown>)?.actions as unknown[] || [];
  }

  return NextResponse.json({ actions: result, sessionId });
}
