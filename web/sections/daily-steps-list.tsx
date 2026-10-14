import { dailyStepsRoute } from "../router";
import { DailyStepsRow } from "./daily-steps-row";

export function DailyStepsList() {
  const { dailySteps, previous, goal } = dailyStepsRoute.useLoaderData();

  return (
    <ul data-stack="y">
      {dailySteps.map((entry, index) => (
        <DailyStepsRow
          entry={entry}
          first={index === 0}
          goal={goal}
          key={entry.day}
          previous={dailySteps[index + 1] ?? previous ?? undefined}
        />
      ))}
    </ul>
  );
}
