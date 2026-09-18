import { exerciseRoute } from "../router";
import { ExerciseHistoryRow } from "./exercise-history-row";

export function ExerciseHistory() {
  const { performances } = exerciseRoute.useLoaderData();

  const history = performances.toReversed();
  const record = performances.toSorted((a, b) => b.bestEstimate - a.bestEstimate)[0];

  return (
    <ul data-stack="y">
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
