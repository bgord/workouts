import * as bg from "@bgord/ui";
import { ExerciseStatisticsKit, performancesOf } from "../kits/exercise-statistics.kit";
import { exerciseRoute } from "../router";
import { ExerciseHistoryRow } from "./exercise-history-row";

export function ExerciseHistory() {
  const t = bg.useTranslations();
  const { exercise, performances } = exerciseRoute.useLoaderData();
  const Statistics = ExerciseStatisticsKit[exercise.data.resistance];

  const history = performances.toReversed();
  const record = Statistics.record(performancesOf(exercise.data.resistance, performances));

  return (
    <ul aria-label={t("statistics.exercise.history")} data-stack="y">
      {history.map((performance, index) => (
        <ExerciseHistoryRow
          index={index}
          key={performance.workoutId}
          last={index === history.length - 1}
          performance={performance}
          previous={history[index + 1]}
          record={performance.workoutId === record?.workoutId}
        />
      ))}
    </ul>
  );
}
