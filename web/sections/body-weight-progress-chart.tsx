import * as bg from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LineChart } from "../services/line-chart";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const POINT_HIT_RADIUS = 8;

export function BodyWeightProgressChart() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const data = measurementsRoute.useLoaderData();

  if (data.measurements.length < LineChart.MINIMAL_POINTS) return null;

  const measurements = data.measurements.toReversed();

  const layout = LineChart.layout(
    measurements.map((measurement) => WeightFormat.kilograms(measurement.weight, BodyWeightDecimals)),
    (weight) => t("measurements.body_weight.value", { weight }),
  );

  const reference = layout.points[measurements.findIndex((measurement) => measurement.reference)];

  return (
    <div data-stack="y" data-variant="flat" {...ui.Gap.related}>
      <ui.SectionHeading>{t("measurements.body_weight.progress")}</ui.SectionHeading>

      <ui.LineChart aria-label={t("measurements.body_weight.progress")}>
        <ui.LineChartGrid
          end={DateFormat.plainDay(language, Temporal.PlainDate.from(measurements.at(-1)!.measuredOn))}
          layout={layout}
          start={DateFormat.plainDay(language, Temporal.PlainDate.from(measurements[0]!.measuredOn))}
        />

        {reference && (
          <g data-color="brand-300" stroke="currentColor" strokeDasharray="4 4">
            <title>{t("measurements.body_weight.stats.since_reference")}</title>

            <line x1={layout.plot.left} x2={layout.plot.right} y1={reference.y} y2={reference.y} />
            <line x1={reference.x} x2={reference.x} y1={layout.plot.top} y2={layout.plot.bottom} />
          </g>
        )}

        <ui.LineChartArea layout={layout} />

        {layout.points.map((point, index) => {
          const measurement = measurements[index]!;

          return (
            <g data-color="brand-300" key={measurement.id}>
              <title>
                {t("measurements.body_weight.progress.point", {
                  date: DateFormat.plainDay(language, Temporal.PlainDate.from(measurement.measuredOn)),
                  weight: WeightFormat.kilograms(measurement.weight, BodyWeightDecimals),
                })}
              </title>

              <circle className="chart-point" cx={point.x} cy={point.y} fill="currentColor" r="4" />

              <circle cx={point.x} cy={point.y} fill="transparent" r={POINT_HIT_RADIUS} />
            </g>
          );
        })}
      </ui.LineChart>
    </div>
  );
}
