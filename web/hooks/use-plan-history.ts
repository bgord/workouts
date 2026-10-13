import { useState } from "react";
import type { PlanHistoryEntry } from "../../modules/plans/value-objects/plan-history-entry";
import { Plans } from "../api";

type PlanHistoryState = "idle" | "loading" | "error" | "done";

export function usePlanHistory(planId: string) {
  const [entries, setEntries] = useState<ReadonlyArray<PlanHistoryEntry>>([]);
  const [next, setNext] = useState<number | null>(null);
  const [state, setState] = useState<PlanHistoryState>("idle");

  const fetchPage = async (before: number | undefined, previous: ReadonlyArray<PlanHistoryEntry>) => {
    setState("loading");

    const response = await Plans.history(null, { planId, before });

    if (!response) return setState("error");

    setEntries([...previous, ...response.data.entries]);
    setNext(response.data.next);
    setState("done");
  };

  const load = () => fetchPage(undefined, []);

  const more = () => fetchPage(next ?? undefined, entries);

  return { entries, next, state, load, more };
}
