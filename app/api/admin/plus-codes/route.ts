import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SLUGS = ["ishikawa", "porques", "smart", "eisenhower", "5s", "pdca"];

function generateCode(): string {
  // Format: XXXXX-XXXXX  (ambiguity-free chars, no 0/O/I/1)
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let a = "", b = "";
  for (let i = 0; i < 5; i++) a += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 5; i++) b += chars[Math.floor(Math.random() * chars.length)];
  return `${a}-${b}`;
}

function auth(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret");
  return secret === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const tool = new URL(request.url).searchParams.get("tool") || undefined;
  const supabase = await createClient();

  let q = supabase
    .from("plus_licenses")
    .select("code, tool_slug, used_by, activated_at, created_at")
    .order("created_at", { ascending: false });
  if (tool) q = q.eq("tool_slug", tool);

  const { data } = await q;
  return NextResponse.json({ codes: data || [] });
}

export async function POST(request: NextRequest) {
  if (!auth(request)) return NextResponse.json({ error: "Não autorizado." }, { status: 401 });

  const { tool_slug, count = 10 } = await request.json();
  if (!SLUGS.includes(tool_slug)) {
    return NextResponse.json({ error: "Ferramenta inválida." }, { status: 400 });
  }

  const supabase = await createClient();

  // Generate unique codes (retry on collision)
  const rows: { code: string; tool_slug: string }[] = [];
  const seen = new Set<string>();
  while (rows.length < count) {
    const code = generateCode();
    if (!seen.has(code)) { seen.add(code); rows.push({ code, tool_slug }); }
  }

  const { data, error } = await supabase.from("plus_licenses").insert(rows).select("code");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ codes: data?.map(r => r.code) || [] });
}
