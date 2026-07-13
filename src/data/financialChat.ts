import { calcMonthlySavings } from "@/utils/simulation";

import type { SimulationRecord } from "./simulation";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function buildFinancialChatPrompt({
  simulation,
  messages,
  question,
}: {
  simulation: SimulationRecord;
  messages: ChatMessage[];
  question: string;
}) {
  const monthlySavings = calcMonthlySavings(simulation);

  const previousMessages = messages
    .slice(-8)
    .map((message) => {
      const author = message.role === "user" ? "Usuário" : "Educador";
      return `${author}: ${message.content}`;
    })
    .join("\n");

  const insightContext = simulation.insight
    ? JSON.stringify(simulation.insight)
    : "O diagnóstico inicial ainda não foi gerado.";

  return `
Você é um educador financeiro dentro de um aplicativo de simulação financeira.

Responda de forma clara, didática, objetiva e acolhedora.
Use português do Brasil.
Não invente dados que não estejam na simulação.
Não diga que você é uma IA.
Responda como um educador financeiro conversando diretamente com o usuário.

Dados da simulação:
- Renda mensal bruta: ${simulation.income}
- Custos fixos: ${simulation.expenses}
- Dívidas / parcelas: ${simulation.debts}
- Meta: ${simulation.goalName}
- Custo da meta: ${simulation.goalAmount}
- Prazo: ${simulation.goalDeadline} meses
- Economia mensal disponível estimada: ${monthlySavings} reais

Diagnóstico inicial já gerado:
${insightContext}

Histórico da conversa:
${previousMessages || "Ainda não existe conversa anterior."}

Pergunta atual do usuário:
${question}

Regras da resposta:
- Responda diretamente a pergunta.
- Use no máximo 3 parágrafos curtos.
- Quando fizer sentido, use uma lista curta.
- Dê exemplos práticos.
- Não use markdown pesado.
`;
}