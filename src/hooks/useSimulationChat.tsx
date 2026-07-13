import { useEffect, useState } from "react";

import {
  buildFinancialChatPrompt,
  type ChatMessage,
} from "@/data/financialChat";
import type { SimulationRecord } from "@/data/simulation";
import { getChatAnswer } from "@/services/aiService";

const getChatStorageKey = (simulationId: string) =>
  `simulation-chat-${simulationId}`;

function getSavedMessages(simulationId: string) {
  const storage = localStorage.getItem(getChatStorageKey(simulationId));

  if (!storage) {
    return [];
  }

  return JSON.parse(storage) as ChatMessage[];
}

export function useSimulationChat(simulation: SimulationRecord | null) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!simulation) {
      return [];
    }

    return getSavedMessages(simulation.id);
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!simulation) {
      return;
    }

    setMessages(getSavedMessages(simulation.id));
  }, [simulation?.id]);

  useEffect(() => {
    if (!simulation) {
      return;
    }

    localStorage.setItem(
      getChatStorageKey(simulation.id),
      JSON.stringify(messages),
    );
  }, [messages, simulation]);

  const sendQuestion = async (question: string) => {
    const trimmedQuestion = question.trim();

    if (!simulation || !trimmedQuestion || isLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuestion,
      createdAt: new Date().toISOString(),
    };

    const messagesWithQuestion = [...messages, userMessage];

    setMessages(messagesWithQuestion);
    setIsLoading(true);
    setError(null);

    try {
      const prompt = buildFinancialChatPrompt({
        simulation,
        messages,
        question: trimmedQuestion,
      });

      const answer = await getChatAnswer(prompt);

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: answer,
        createdAt: new Date().toISOString(),
      };

      setMessages([...messagesWithQuestion, assistantMessage]);
    } catch {
      setError(
        "Não foi possível gerar uma resposta agora. Verifique sua conexão ou tente novamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendQuestion,
  };
}