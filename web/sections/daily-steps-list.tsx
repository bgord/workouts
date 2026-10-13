import { dailyStepsRoute } from "../router";
import { DailyStepsRow } from "./daily-steps-row";

export function DailyStepsList() {
  const { dailySteps } = dailyStepsRoute.useLoaderData();

  return (
    <ul data-stack="y">
      {dailySteps.map((entry, index) => (
        <DailyStepsRow entry={entry} first={index === 0} key={entry.day} />
      ))}
    </ul>
  );
}
