import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { systemPrompt, userPrompt } = await request.json();

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    const data = await resp.json();
    const text =
      data.content?.map((c: { type: string; text?: string }) => c.text || "").join("") ||
      "Erro na resposta.";

    return NextResponse.json({ text });
  } catch {
    return NextResponse.json({ error: "Erro ao conectar com a IA" }, { status: 500 });
  }
}
