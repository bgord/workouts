// cSpell:ignore GRIDLINE GRIDLINES
import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { EqualApproximately } from "lucide-react";
import { Form as WorkoutHistoryFilters } from "../../app/services/workout-history-filters-form";
import type { ExercisePerformance } from "../../modules/statistics/value-objects/exercise-performance";
import * as ui from "../components";
import { WeightFormat } from "../services/weight-format";

const WIDTH = 600;
const HEIGHT = 200;
const PADDING = { top: 12, right: 0, bottom: 26 };
const LABEL_FONT_SIZE = 11;
const LABEL_CHAR_WIDTH = LABEL_FONT_SIZE * 0.6;

const plot = (left: number) => ({
  top: PADDING.top,
  right: WIDTH - PADDING.right,
  bottom: HEIGHT - PADDING.bottom,
  left,
  width: WIDTH - left - PADDING.right,
  height: HEIGHT - PADDING.top - PADDING.bottom,
});

const MINIMAL_POINTS = 2;
const SCALE_MARGIN = 1;
const GRIDLINES_LIMIT = 5;
const GRIDLINE_LABEL_GAP = 8;
const DATE_LABEL_BASELINE = HEIGHT - 6;
const AREA_OPACITY = 0.08;

export function ExerciseProgressChart(props: { performances: Array<ExercisePerformance> }) {
  const t = useTranslations();

  if (props.performances.length < MINIMAL_POINTS) return null;

  const kilograms = props.performances.map((performance) => WeightFormat.kilograms(performance.bestEstimate));

  const floor = Math.max(Math.floor(Math.min(...kilograms)) - SCALE_MARGIN, 0);
  const ceiling = Math.ceil(Math.max(...kilograms)) + SCALE_MARGIN;
  const step = Math.ceil((ceiling - floor) / GRIDLINES_LIMIT);

  const labels = Array.from({ length: Math.floor((ceiling - floor) / step) + 1 }, (_, index) => {
    const estimate = floor + index * step;

    return { estimate, text: t("statistics.exercise.one_rep_max_estimate.value", { load: estimate }) };
  });

  const PLOT = plot(
    Math.max(...labels.map((label) => label.text.length)) * LABEL_CHAR_WIDTH + GRIDLINE_LABEL_GAP,
  );

  const toY = (estimate: number) => PLOT.bottom - ((estimate - floor) / (ceiling - floor)) * PLOT.height;

  const gridlines = labels.map((label) => ({ ...label, y: toY(label.estimate) }));

  const points = props.performances.map((performance, index) => ({
    performance,
    x: PLOT.left + (index * PLOT.width) / (props.performances.length - 1),
    y: toY(kilograms[index]!),
  }));

  const first = points[0]!;
  const last = points.at(-1)!;
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div data-stack="y" data-variant="flat" {...ui.Spacing.related}>
      <div data-cross="center" data-main="between" data-stack="x" {...ui.Spacing.related}>
        <ui.SectionHeading>{t("statistics.exercise.progress")}</ui.SectionHeading>

        <ui.Eyebrow data-cross="center" data-stack="x">
          <EqualApproximately data-color="neutral-600" data-size="xs" />
          {t("statistics.exercise.one_rep_max_estimate")}
        </ui.Eyebrow>
      </div>

      <svg
        aria-label={t("statistics.exercise.progress")}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
      >
        <g data-color="neutral-800" stroke="currentColor">
          {gridlines.map((gridline) => (
            <line key={gridline.estimate} x1={PLOT.left} x2={PLOT.right} y1={gridline.y} y2={gridline.y} />
          ))}
        </g>

        <g data-color="neutral-500" fill="currentColor" fontSize={LABEL_FONT_SIZE}>
          {gridlines.map((gridline) => (
            <text dominantBaseline="middle" key={gridline.estimate} x={0} y={gridline.y}>
              {gridline.text}
            </text>
          ))}

          <text x={PLOT.left} y={DATE_LABEL_BASELINE}>
            {first.performance.scheduledFor}
          </text>

          <text textAnchor="end" x={PLOT.right} y={DATE_LABEL_BASELINE}>
            {last.performance.scheduledFor}
          </text>
        </g>

        <polygon
          data-color="brand-500"
          fill="currentColor"
          fillOpacity={AREA_OPACITY}
          points={`${first.x},${PLOT.bottom} ${line} ${last.x},${PLOT.bottom}`}
        />

        <polyline
          data-color="brand-400"
          fill="none"
          points={line}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
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
                date: point.performance.scheduledFor,
                load: WeightFormat.kilograms(point.performance.bestEstimate),
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
        ))}
      </svg>
    </div>
  );
}
