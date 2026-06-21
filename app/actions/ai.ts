"use server";

import { Anthropic } from "@anthropic-ai/sdk";
import { getUser } from "./auth";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Prompts de sistema por ferramenta
const SYSTEM_PROMPTS = {
  ishikawa: `Você é um especialista em melhoria contínua e qualidade hospitalar com vasta experiência em operações hoteleiras e multifamily. Analise diagramas de Ishikawa de forma objetiva, prática e orientada a ação. Responda sempre em português brasileiro. Seja direto e profissional.`,

  porques: `Você é um especialista em análise de causa raiz e metodologia Toyota/Lean com experiência em hotelaria e gestão de operações. Avalie cadeias de 5 Porquês com rigor técnico e visão prática. Responda sempre em português brasileiro.`,

  smart: `Você é um especialista em gestão de metas e planejamento estratégico com experiência em operações hoteleiras. Valide e aprimore metas SMART com rigor e praticidade. Responda sempre em português brasileiro.`,

  eisenhower: `Você é um especialista em gestão do tempo, liderança e produtividade com experiência em gestão hoteleira e operações. Analise matrizes de Eisenhower com foco em resultados práticos. Responda sempre em português brasileiro.`,

  "5s": `Você é um especialista em metodologia 5S e gestão de qualidade com experiência em hotelaria e operações de housekeeping/governança. Analise avaliações 5S com rigor técnico e visão prática de implementação. Responda sempre em português brasileiro.`,

  pdca: `Você é um especialista em metodologia PDCA e melhoria contínua com experiência em gestão hoteleira e operações. Analise ciclos PDCA com rigor técnico, identificando lacunas no raciocínio e propondo próximos passos práticos. Responda sempre em português brasileiro.`,
};

export async function generateAnalysis(
  toolSlug: keyof typeof SYSTEM_PROMPTS,
  userPrompt: string
) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const systemPrompt = SYSTEM_PROMPTS[toolSlug];
  if (!systemPrompt) return { error: "Ferramenta não encontrada" };

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const analysis =
      message.content[0].type === "text" ? message.content[0].text : "";
    return { analysis };
  } catch (error) {
    console.error("AI error:", error);
    return { error: "Erro ao gerar análise com IA" };
  }
}

export async function generateActionPlan(
  toolSlug: keyof typeof SYSTEM_PROMPTS,
  analysis: string
) {
  const user = await getUser();
  if (!user) return { error: "Não autenticado" };

  const systemPrompt = SYSTEM_PROMPTS[toolSlug];
  if (!systemPrompt) return { error: "Ferramenta não encontrada" };

  try {
    const message = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: `Com base nesta análise, crie um plano de ação estruturado com:
1. Lista de ações concretas (bullet points)
2. Responsável sugerido para cada ação
3. Prazo estimado
4. Indicadores de sucesso

Análise:
${analysis}`,
        },
      ],
    });

    const actionPlan =
      message.content[0].type === "text" ? message.content[0].text : "";
    return { actionPlan };
  } catch (error) {
    console.error("AI error:", error);
    return { error: "Erro ao gerar plano de ação" };
  }
}
