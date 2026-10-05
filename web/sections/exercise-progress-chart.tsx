import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import * as ui from "../components";
import { ExerciseStatisticsKit } from "../kits/exercise-statistics.kit";
import { exerciseRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LineChartMath } from "../services/line-chart";

export function ExerciseProgressChart() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { exercise, performances } = exerciseRoute.useLoaderData();
  const Statistics = ExerciseStatisticsKit[exercise.data.resistance];

  if (performances.length < LineChartMath.MINIMAL_POINTS) return null;

  const layout = LineChartMath.layout(performances.map(Statistics.progress.value), (value) =>
    Statistics.progress.format(t, language, value),
  );

  return (
    <div data-stack="y" data-variant="flat" {...ui.Gap.related}>
      <div data-main="between" data-stack="x" data-wrap="wrap" {...ui.Gap.related}>
        <h2>{t("statistics.exercise.progress")}</h2>

        <h3 data-stack="x">
          <Statistics.progress.Label />
        </h3>
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
              to="/workouts/$workoutId"
            >
              <title>
                {t("statistics.exercise.progress.point", {
                  date: DateFormat.plainDay(language, performance.scheduledFor),
                  value: Statistics.progress.format(t, language, Statistics.progress.value(performance)),
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
