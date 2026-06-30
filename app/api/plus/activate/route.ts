import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { code, tool_slug } = await request.json();

  if (!code || !tool_slug) {
    return NextResponse.json({ error: "Código e ferramenta são obrigatórios." }, { status: 400 });
  }

  const clean = String(code).trim().toUpperCase().replace(/\s/g, "");
  const supabase = await createClient();

  const { data: license } = await supabase
    .from("plus_licenses")
    .select("id, tool_slug, used_by")
    .eq("code", clean)
    .eq("tool_slug", tool_slug)
    .maybeSingle();

  if (!license) {
    return NextResponse.json({ error: "Código inválido ou não corresponde a esta ferramenta." }, { status: 404 });
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session_id")?.value || null;

  if (license.used_by && license.used_by !== sessionId) {
    return NextResponse.json({ error: "Este código já foi utilizado em outro dispositivo." }, { status: 409 });
  }

  if (!license.used_by && sessionId) {
    await supabase
      .from("plus_licenses")
      .update({ used_by: sessionId, activated_at: new Date().toISOString() })
      .eq("id", license.id);
  }

  // Merge with existing plus_tools cookie
  const existing = cookieStore.get("plus_tools")?.value || "";
  const tools = existing ? existing.split(",").filter(Boolean) : [];
  if (!tools.includes(tool_slug)) tools.push(tool_slug);

  const response = NextResponse.json({ ok: true, tool_slug });
  response.cookies.set("plus_tools", tools.join(","), {
    httpOnly: false, // must be readable by client JS
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365 * 3,
    path: "/",
  });
  return response;
}
