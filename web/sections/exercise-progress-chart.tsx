// cSpell:ignore GRIDLINE GRIDLINES
import { useLanguage, useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import { ChartScale } from "../services/chart-scale";
import { DateFormat } from "../services/date-format";
import { WeightFormat } from "../services/weight-format";

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = { top: 12, right: 12, bottom: 26, left: 66 };

const PLOT = {
  top: PADDING.top,
  right: WIDTH - PADDING.right,
  bottom: HEIGHT - PADDING.bottom,
  left: PADDING.left,
  width: WIDTH - PADDING.left - PADDING.right,
  height: HEIGHT - PADDING.top - PADDING.bottom,
};

const MINIMAL_POINTS = 2;
const GRIDLINES = [0, 0.5, 1];
const GRIDLINE_LABEL_GAP = 8;
const DATE_LABEL_BASELINE = HEIGHT - 6;

export function ExerciseProgressChart(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();
  const language = useLanguage();

  if (props.performances.length < MINIMAL_POINTS) return null;

  const scale = ChartScale.of(props.performances.map((performance) => performance.bestEstimate));

  const toY = (estimate: number) => PLOT.bottom - scale.ratio(estimate) * PLOT.height;

  const gridlines = GRIDLINES.map((ratio) => {
    const estimate = scale.at(ratio);

    return { ratio, estimate, y: toY(estimate) };
  });

  const points = props.performances.map((performance, index) => ({
    performance,
    x: PLOT.left + (index * PLOT.width) / (props.performances.length - 1),
    y: toY(performance.bestEstimate),
  }));

  const first = points[0]!;
  const last = points.at(-1)!;

  return (
    <svg
      aria-label={t("statistics.exercise.progress")}
      role="img"
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      width="100%"
    >
      <g data-color="neutral-800" stroke="currentColor">
        {gridlines.map((gridline) => (
          <line key={gridline.ratio} x1={PLOT.left} x2={PLOT.right} y1={gridline.y} y2={gridline.y} />
        ))}
      </g>

      <g data-color="neutral-500" fill="currentColor" fontSize="11">
        {gridlines.map((gridline) => (
          <text
            dominantBaseline="middle"
            key={gridline.ratio}
            textAnchor="end"
            x={PLOT.left - GRIDLINE_LABEL_GAP}
            y={gridline.y}
          >
            {t("statistics.exercise.one_rep_max_estimate.value", {
              load: WeightFormat.kilograms(gridline.estimate),
            })}
          </text>
        ))}

        <text x={PLOT.left} y={DATE_LABEL_BASELINE}>
          {DateFormat.day(language, DateFormat.zoned(first.performance.performedAt))}
        </text>

        <text textAnchor="end" x={PLOT.right} y={DATE_LABEL_BASELINE}>
          {DateFormat.day(language, DateFormat.zoned(last.performance.performedAt))}
        </text>
      </g>

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
    </svg>
  );
}
