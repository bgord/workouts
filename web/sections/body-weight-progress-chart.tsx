// cSpell:ignore GRIDLINE GRIDLINES
import { useLanguage, useTranslations } from "@bgord/ui";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { ChartScale } from "../services/chart-scale";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

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
const AREA_OPACITY = 0.08;

export function BodyWeightProgressChart(props: { measurements: ReadonlyArray<BodyWeightMeasurement> }) {
  const t = useTranslations();
  const language = useLanguage();

  if (props.measurements.length < MINIMAL_POINTS) return null;

  const measurements = props.measurements.toReversed();

  const scale = ChartScale.of(measurements.map((measurement) => measurement.weight));

  const toY = (weight: number) => PLOT.bottom - scale.ratio(weight) * PLOT.height;

  const gridlines = GRIDLINES.map((ratio) => {
    const weight = scale.at(ratio);

    return { ratio, weight, y: toY(weight) };
  });

  const points = measurements.map((measurement, index) => ({
    measurement,
    x: PLOT.left + (index * PLOT.width) / (measurements.length - 1),
    y: toY(measurement.weight),
  }));

  const first = points[0]!;
  const last = points.at(-1)!;
  const reference = points.find((point) => point.measurement.reference);
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="c-card" data-gap="4" data-md-p="2-5" data-stack="y" data-variant="flat">
      <div className="c-card-title">{t("measurements.body_weight.progress")}</div>

      <svg
        aria-label={t("measurements.body_weight.progress")}
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
              {t("measurements.body_weight.value", {
                weight: WeightFormat.kilograms(gridline.weight, BodyWeightDecimals),
              })}
            </text>
          ))}

          <text x={PLOT.left} y={DATE_LABEL_BASELINE}>
            {DateFormat.plainDay(language, Temporal.PlainDate.from(first.measurement.measuredOn))}
          </text>

          <text textAnchor="end" x={PLOT.right} y={DATE_LABEL_BASELINE}>
            {DateFormat.plainDay(language, Temporal.PlainDate.from(last.measurement.measuredOn))}
          </text>
        </g>

        {reference && (
          <g data-color="brand-300" stroke="currentColor" strokeDasharray="4 4">
            <title>{t("measurements.body_weight.stats.since_reference")}</title>

            <line x1={PLOT.left} x2={PLOT.right} y1={reference.y} y2={reference.y} />
            <line x1={reference.x} x2={reference.x} y1={PLOT.top} y2={PLOT.bottom} />
          </g>
        )}

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
          <g key={point.measurement.id}>
            <title>
              {t("measurements.body_weight.progress.point", {
                date: DateFormat.plainDay(language, Temporal.PlainDate.from(point.measurement.measuredOn)),
                weight: WeightFormat.kilograms(point.measurement.weight, BodyWeightDecimals),
              })}
            </title>
          </g>
        ))}
      </svg>
    </div>
  );
}
