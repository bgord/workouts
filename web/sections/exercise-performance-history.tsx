// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { ExerciseHistory } from "./exercise-history";
import { ExerciseProgressChart } from "./exercise-progress-chart";
import { ExerciseStats } from "./exercise-stats";

export function ExercisePerformanceHistory() {
  const t = bg.useTranslations();
  const { performances } = exerciseRoute.useLoaderData();

  if (performances.length === 0) return null;

  return (
    <div data-stack="y" {...ui.Gap.section}>
      <ExerciseStats />

      <ExerciseProgressChart />

      <div data-stack="y" {...ui.Gap.related}>
        <ui.SectionHeading>{t("statistics.exercise.history")}</ui.SectionHeading>

        <ExerciseHistory />
      </div>
    </div>
  );
}
