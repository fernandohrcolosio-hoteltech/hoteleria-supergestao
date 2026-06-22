import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY não configurada no servidor." }, { status: 500 });
  }

  try {
    const { systemPrompt, userPrompt } = await request.json();

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      const detail = data?.error?.message || JSON.stringify(data);
      console.error("[AI] Anthropic API error:", resp.status, detail);
      return NextResponse.json({ error: `Erro da API Anthropic (${resp.status}): ${detail}` }, { status: 502 });
    }

    const text =
      data.content?.map((c: { type: string; text?: string }) => c.text || "").join("") || "";

    if (!text) {
      console.error("[AI] Resposta vazia:", JSON.stringify(data));
      return NextResponse.json({ error: "A IA retornou resposta vazia." }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("[AI] Exceção:", err);
    return NextResponse.json({ error: "Erro interno ao conectar com a IA." }, { status: 500 });
  }
}
