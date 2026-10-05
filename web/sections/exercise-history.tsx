import * as bg from "@bgord/ui";
import { exerciseRoute } from "../router";
import { ExerciseHistoryRow } from "./exercise-history-row";

export function ExerciseHistory() {
  const t = bg.useTranslations();
  const { performances, records } = exerciseRoute.useLoaderData();

  const history = performances.toReversed();

  return (
    <ul aria-label={t("statistics.exercise.history")} data-stack="y">
      {history.map((performance, index) => (
        <ExerciseHistoryRow
          index={index}
          key={performance.workoutId}
          last={index === history.length - 1}
          performance={performance}
          previous={history[index + 1]}
          record={performance.workoutId === records?.peak.workoutId}
        />
      ))}
    </ul>
  );
}
