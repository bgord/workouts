// cSpell:ignore GRIDLINES
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { DateFormat } from "../services/date-format";
import { WeightFormat } from "../services/weight-format";

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = { top: 12, right: 12, bottom: 26, left: 66 };

const PLOT_WIDTH = WIDTH - PADDING.left - PADDING.right;
const PLOT_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

const MINIMAL_POINTS = 2;
const GRIDLINES = [0, 0.5, 1];

export function ExerciseProgressChart(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();
  const language = useLanguage();

  if (props.performances.length < MINIMAL_POINTS) return null;

  const estimates = props.performances.map((performance) => performance.bestEstimate);

  const lowest = Math.min(...estimates);
  const highest = Math.max(...estimates);
  const padding = (highest - lowest) / 10 || highest / 10;

  const floor = lowest - padding;
  const ceiling = highest + padding;

  const x = (index: number) => PADDING.left + (index * PLOT_WIDTH) / (props.performances.length - 1);
  const y = (estimate: number) =>
    PADDING.top + PLOT_HEIGHT - ((estimate - floor) / (ceiling - floor)) * PLOT_HEIGHT;

  const points = props.performances.map((performance, index) => ({
    performance,
    x: x(index),
    y: y(performance.bestEstimate),
  }));

  return (
    <svg
      aria-label={t("statistics.exercise.progress")}
      role="img"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
    >
      {GRIDLINES.map((ratio) => {
        const estimate = floor + (ceiling - floor) * ratio;

        return (
          <g key={ratio}>
            <line
              data-color="neutral-800"
              stroke="currentColor"
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={y(estimate)}
              y2={y(estimate)}
            />

            <text
              data-color="neutral-500"
              dominantBaseline="middle"
              fill="currentColor"
              fontSize="11"
              textAnchor="end"
              x={PADDING.left - 8}
              y={y(estimate)}
            >
              {t("statistics.exercise.one_rep_max_estimate.value", {
                load: WeightFormat.kilograms(estimate),
              })}
            </text>
          </g>
        );
      })}

      <polyline
        data-color="brand-400"
        fill="none"
        points={points.map((point) => `${point.x},${point.y}`).join(" ")}
        stroke="currentColor"
        strokeWidth="2"
      />

      {points.map((point) => (
        <Link
          data-color="brand-300"
          key={point.performance.workoutId}
          params={{ workoutId: point.performance.workoutId }}
          search={WorkoutHistoryFilters.default}
          to="/workouts/$workoutId"
        >
          <title>
            {t("statistics.exercise.progress.point", {
              date: DateFormat.dayWithTime(language, DateFormat.zoned(point.performance.performedAt)),
              load: WeightFormat.kilograms(point.performance.bestEstimate),
            })}
          </title>

          <circle cx={point.x} cy={point.y} fill="currentColor" r="4" />
        </Link>
      ))}

      <text data-color="neutral-500" fill="currentColor" fontSize="11" x={PADDING.left} y={HEIGHT - 6}>
        {DateFormat.day(language, DateFormat.zoned(props.performances[0]!.performedAt))}
      </text>

      <text
        data-color="neutral-500"
        fill="currentColor"
        fontSize="11"
        textAnchor="end"
        x={WIDTH - PADDING.right}
        y={HEIGHT - 6}
      >
        {DateFormat.day(language, DateFormat.zoned(props.performances.at(-1)!.performedAt))}
      </text>
    </svg>
  );
}
