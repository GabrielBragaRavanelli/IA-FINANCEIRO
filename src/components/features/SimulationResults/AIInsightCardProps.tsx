import "react-loading-skeleton/dist/skeleton.css";

import { Send } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";

import { useInsight } from "@/hooks/useInsight";
import { useSimulationChat } from "@/hooks/useSimulationChat";
import { useSimulationStorage } from "@/hooks/useSimulationStorage";

import { Content } from "../Insights/Content";
import { Error } from "../Insights/Error";

interface AIInsightCardProps {
  simulationId: string;
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { getFormData } = useSimulationStorage();
  const simulation = getFormData(simulationId);

  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId);

  const {
    messages,
    isLoading: isChatLoading,
    error: chatError,
    sendQuestion,
  } = useSimulationChat(simulation);

  const [question, setQuestion] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const currentQuestion = question.trim();

    if (!currentQuestion) {
      return;
    }

    setQuestion("");
    await sendQuestion(currentQuestion);
  };

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <div className="mb-3 flex items-center gap-1.5">
        <span>✨</span>

        <span className="text-primary text-xs font-semibold tracking-widest uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>

      {isLoading && (
        <div className="flex">
          <Skeleton
            count={10.5}
            baseColor="var(--color-skeleton-base)"
            highlightColor="var(--color-skeleton-highlight)"
            className="mb-3 flex rounded-lg"
            containerClassName="flex-1"
            inline
          />
        </div>
      )}

      {!isLoading && error && (
        <Error
          simulationId={simulationId}
          message={error}
          onRetry={() => {
            fetchInsight(simulationId);
          }}
        />
      )}

      {!isLoading && insight && !error && <Content insight={insight} />}

      <section className="border-border mt-6 border-t pt-6">
        <div className="mb-4">
          <h3 className="text-foreground text-base font-bold">
            Converse com o Educador Financeiro
          </h3>

          <p className="text-muted-foreground mt-1 text-sm">
            Faça perguntas sobre esta simulação e continue a conversa quando
            quiser.
          </p>
        </div>

        <div className="border-border bg-background max-h-80 overflow-y-auto rounded-2xl border p-4">
          {messages.length === 0 && !isChatLoading && (
            <div className="text-muted-foreground rounded-xl border border-dashed border-(--border) p-4 text-sm">
              Nenhuma pergunta feita ainda. Você pode perguntar, por exemplo:
              “Como posso economizar mais rápido?” ou “Essa meta está realista?”
            </div>
          )}

          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-card text-foreground border-border mr-auto border"
                }`}
              >
                <p className="mb-1 text-xs font-semibold opacity-80">
                  {message.role === "user" ? "Você" : "Educador financeiro"}
                </p>

                <p>{message.content}</p>
              </div>
            ))}

            {isChatLoading && (
              <div className="bg-card text-muted-foreground border-border mr-auto rounded-2xl border px-4 py-3 text-sm">
                Educador financeiro está respondendo...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {chatError && (
          <p className="mt-3 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
            {chatError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Digite sua pergunta sobre a simulação..."
            rows={3}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-2xl border px-4 py-3 text-sm outline-none transition focus:border-(--primary)"
            disabled={isChatLoading}
          />

          <button
            type="submit"
            disabled={isChatLoading || !question.trim()}
            className="bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={16} />
            {isChatLoading ? "Enviando..." : "Enviar pergunta"}
          </button>
        </form>
      </section>
    </div>
  );
}
