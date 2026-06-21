// Ferramentas disponíveis
export type ToolSlug = "ishikawa" | "porques" | "smart" | "eisenhower" | "5s" | "pdca";

export const TOOLS: Record<ToolSlug, { name: string; icon: string; badge: string }> = {
  ishikawa: { name: "Diagrama de Ishikawa", icon: "🐟", badge: "Causa e Efeito" },
  porques: { name: "5 Porquês", icon: "❓", badge: "Causa Raiz" },
  smart: { name: "Metas SMART", icon: "🎯", badge: "Definição de Metas" },
  eisenhower: { name: "Matriz de Eisenhower", icon: "⚡", badge: "Priorização" },
  "5s": { name: "Programa 5S", icon: "🧹", badge: "Organização" },
  pdca: { name: "Ciclo PDCA", icon: "🔄", badge: "Ciclo de Melhoria" },
};

// Planos comerciais
export type PlanType = "avulso" | "pacote";

export interface Plan {
  id: string;
  name: string;
  slug: string;
  type: PlanType;
  tools: ToolSlug[];
  price_brl: number; // centavos
  active: boolean;
  created_at: string;
}

// Compra via Mercado Pago
export type MercadopagoStatus = "pending" | "approved" | "rejected" | "cancelled";

export interface Purchase {
  id: string;
  plan_id: string;
  email: string;
  mp_preference_id: string;
  mp_payment_id: string | null;
  mp_status: MercadopagoStatus;
  onboarding_token: string;
  token_used: boolean;
  created_at: string;
  updated_at: string;
}

// Entrada de ferramenta (análise salva)
export interface ToolEntry {
  id: string;
  user_id: string;
  tool_slug: ToolSlug;
  name: string;
  data: Record<string, unknown>;
  ai_analysis: string | null;
  action_plan: unknown | null;
  created_at: string;
  updated_at: string;
}
