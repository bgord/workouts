import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { EqualApproximately } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { LineChartMath } from "../services/line-chart";
import { WeightFormat } from "../services/weight-format";

export function ExerciseProgressChart() {
  const t = bg.useTranslations();
  const { performances } = exerciseRoute.useLoaderData();

  if (performances.length < LineChartMath.MINIMAL_POINTS) return null;

  const layout = LineChartMath.layout(
    performances.map((performance) => WeightFormat.kilograms(performance.bestEstimate)),
    (load) => t("statistics.exercise.one_rep_max_estimate.value", { load }),
  );

  return (
    <div data-stack="y" data-variant="flat" {...ui.Gap.related}>
      <div data-cross="center" data-main="between" data-stack="x" {...ui.Gap.related}>
        <ui.SectionHeading>{t("statistics.exercise.progress")}</ui.SectionHeading>

        <ui.Eyebrow data-cross="center" data-stack="x">
          <EqualApproximately data-color="neutral-600" data-size="xs" />
          {t("statistics.exercise.one_rep_max_estimate")}
        </ui.Eyebrow>
      </div>

      <ui.LineChart aria-label={t("statistics.exercise.progress")}>
        <ui.LineChartGrid
          end={performances.at(-1)!.scheduledFor}
          layout={layout}
          start={performances[0]!.scheduledFor}
        />

        <ui.LineChartArea layout={layout} />

        {layout.points.map((point, index) => {
          const performance = performances[index]!;

          return (
            <Link
              data-color="brand-300"
              key={performance.workoutId}
              params={{ workoutId: performance.workoutId }}
              search={WorkoutHistoryFilters.default}
              to="/workouts/$workoutId"
            >
              <title>
                {t("statistics.exercise.progress.point", {
                  date: performance.scheduledFor,
                  load: WeightFormat.kilograms(performance.bestEstimate),
                })}
              </title>

              <circle cx={point.x} cy={point.y} data-color="neutral-900" fill="currentColor" r="4" />

              <circle
                cx={point.x}
                cy={point.y}
                data-color="brand-400"
                fill="none"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
            </Link>
          );
        })}
      </ui.LineChart>
    </div>
  );
}
