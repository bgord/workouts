// cSpell:ignore GRIDLINE GRIDLINES
import { useLanguage, useTranslations } from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

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
const GRIDLINES_LIMIT = 5;
const SCALE_MARGIN = 1;
const GRIDLINE_LABEL_GAP = 8;
const DATE_LABEL_BASELINE = HEIGHT - 6;
const AREA_OPACITY = 0.08;
const POINT_HIT_RADIUS = 8;

export function BodyWeightProgressChart() {
  const t = useTranslations();
  const language = useLanguage();
  const data = measurementsRoute.useLoaderData();

  if (data.measurements.length < MINIMAL_POINTS) return null;

  const measurements = data.measurements.toReversed();

  const kilograms = measurements.map((measurement) =>
    WeightFormat.kilograms(measurement.weight, BodyWeightDecimals),
  );

  const floor = Math.floor(Math.min(...kilograms)) - SCALE_MARGIN;
  const ceiling = Math.ceil(Math.max(...kilograms)) + SCALE_MARGIN;
  const step = Math.ceil((ceiling - floor) / GRIDLINES_LIMIT);

  const labels = Array.from({ length: Math.floor((ceiling - floor) / step) + 1 }, (_, index) => {
    const weight = floor + index * step;

    return { weight, text: t("measurements.body_weight.value", { weight }) };
  });

  const PLOT = plot(
    Math.max(...labels.map((label) => label.text.length)) * LABEL_CHAR_WIDTH + GRIDLINE_LABEL_GAP,
  );

  const toY = (weight: number) => PLOT.bottom - ((weight - floor) / (ceiling - floor)) * PLOT.height;

  const gridlines = labels.map((label) => ({ ...label, y: toY(label.weight) }));

  const points = measurements.map((measurement, index) => ({
    measurement,
    x: PLOT.left + (index * PLOT.width) / (measurements.length - 1),
    y: toY(kilograms[index]!),
  }));

  const first = points[0]!;
  const last = points.at(-1)!;
  const reference = points.find((point) => point.measurement.reference);
  const line = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div data-stack="y" data-variant="flat" {...ui.Gap.related}>
      <ui.SectionHeading>{t("measurements.body_weight.progress")}</ui.SectionHeading>

      <svg
        aria-label={t("measurements.body_weight.progress")}
        role="img"
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        width="100%"
      >
        <g data-color="neutral-800" stroke="currentColor">
          {gridlines.map((gridline) => (
            <line key={gridline.weight} x1={PLOT.left} x2={PLOT.right} y1={gridline.y} y2={gridline.y} />
          ))}
        </g>

        <g data-color="neutral-500" fill="currentColor" fontSize={LABEL_FONT_SIZE}>
          {gridlines.map((gridline) => (
            <text dominantBaseline="middle" key={gridline.weight} x={0} y={gridline.y}>
              {gridline.text}
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
          <g data-color="brand-300" key={point.measurement.id}>
            <title>
              {t("measurements.body_weight.progress.point", {
                date: DateFormat.plainDay(language, Temporal.PlainDate.from(point.measurement.measuredOn)),
                weight: WeightFormat.kilograms(point.measurement.weight, BodyWeightDecimals),
              })}
            </title>

            <circle className="chart-point" cx={point.x} cy={point.y} fill="currentColor" r="4" />

            <circle cx={point.x} cy={point.y} fill="transparent" r={POINT_HIT_RADIUS} />
          </g>
        ))}
      </svg>
    </div>
  );
}
