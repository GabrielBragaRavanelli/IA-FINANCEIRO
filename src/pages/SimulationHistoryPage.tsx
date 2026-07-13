import { CalendarClock, Eye, PiggyBank, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { PageHero } from "@/components/shared/PageHero";
import type { SimulationRecord } from "@/data/simulation";
import { useSimulationStorage } from "@/hooks/useSimulationStorage";
import { calcMonthlySavings } from "@/utils/simulation";

function formatDate(date?: string) {
  if (!date) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function SimulationHistoryPage() {
  const { getAllSimulations, deleteSimulation } = useSimulationStorage();

  const [simulations, setSimulations] = useState<SimulationRecord[]>(() =>
    [...getAllSimulations()].reverse(),
  );

  const handleDelete = (id: string) => {
    deleteSimulation(id);
    setSimulations((currentSimulations) =>
      currentSimulations.filter((simulation) => simulation.id !== id),
    );
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <PageHero
        title="Histórico de simulações"
        subtitle="Consulte suas simulações anteriores, veja os detalhes ou exclua registros salvos."
      />

      {simulations.length === 0 ? (
        <section className="bg-card rounded-2xl p-8 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <h2 className="text-foreground text-xl font-bold">
            Nenhuma simulação salva ainda
          </h2>

          <p className="text-muted-foreground mt-2 text-sm">
            Faça uma nova simulação para que ela apareça aqui no histórico.
          </p>

          <Link
            to="/"
            className="bg-primary text-primary-foreground mt-6 inline-flex rounded-xl px-5 py-3 text-sm font-semibold transition hover:opacity-90"
          >
            Criar nova simulação
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {simulations.map((simulation) => {
            const monthlySavings = calcMonthlySavings(simulation);

            return (
              <article
                key={simulation.id}
                className="bg-card flex flex-col justify-between rounded-2xl p-5 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <span className="text-primary text-xs font-semibold tracking-widest uppercase">
                        Simulação
                      </span>

                      <h2 className="text-foreground mt-1 line-clamp-2 text-lg font-bold">
                        {simulation.goalName}
                      </h2>
                    </div>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        simulation.insight
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {simulation.insight ? "Com insight" : "Sem insight"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="border-border rounded-xl border p-3">
                      <p className="text-muted-foreground text-xs">
                        Valor da meta
                      </p>

                      <p className="text-foreground mt-1 font-semibold">
                        {simulation.goalAmount}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="border-border rounded-xl border p-3">
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <CalendarClock size={14} />
                          Prazo
                        </div>

                        <p className="text-foreground mt-1 font-semibold">
                          {simulation.goalDeadline} meses
                        </p>
                      </div>

                      <div className="border-border rounded-xl border p-3">
                        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
                          <PiggyBank size={14} />
                          Economia mensal
                        </div>

                        <p className="text-foreground mt-1 font-semibold">
                          {formatCurrency(monthlySavings)}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground text-xs">
                      Criada em: {formatDate(simulation.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Link
                    to={`/resultado/${simulation.id}`}
                    className="bg-primary text-primary-foreground inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition hover:opacity-90"
                  >
                    <Eye size={16} />
                    Ver detalhes
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDelete(simulation.id)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={16} />
                    Excluir
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </main>
  );
}
