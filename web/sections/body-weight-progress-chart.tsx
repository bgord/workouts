import * as bg from "@bgord/ui";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LineChartMath } from "../services/line-chart";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const POINT_HIT_RADIUS = 8;

export function BodyWeightProgressChart() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const data = measurementsRoute.useLoaderData();

  if (data.measurements.length < LineChartMath.MINIMAL_POINTS) return null;

  const measurements = data.measurements.toReversed();

  const layout = LineChartMath.layout(
    measurements.map((measurement) => WeightFormat.kilograms(measurement.weight, BodyWeightDecimals)),
    (weight) => t("measurements.body_weight.value", { weight }),
  );

  const reference = layout.points[measurements.findIndex((measurement) => measurement.reference)];

  return (
    <div data-stack="y" data-variant="flat" {...ui.Gap.related}>
      <h2>{t("measurements.body_weight.progress")}</h2>

      <ui.LineChart aria-label={t("measurements.body_weight.progress")}>
        <ui.LineChartGrid
          end={DateFormat.plainDay(language, measurements.at(-1)!.measuredOn)}
          layout={layout}
          start={DateFormat.plainDay(language, measurements[0]!.measuredOn)}
        />

        {reference && (
          <g data-color="brand-300" stroke="currentColor" strokeDasharray="4 4">
            <title>{t("measurements.body_weight.stats.since_reference")}</title>

            <line x1={layout.plot.left} x2={layout.plot.right} y1={reference.y} y2={reference.y} />
            <line x1={reference.x} x2={reference.x} y1={layout.plot.top} y2={layout.plot.bottom} />
          </g>
        )}

        <ui.LineChartArea layout={layout} />

        <g data-color="brand-300" fill="currentColor">
          {layout.points.map((point, index) => {
            const measurement = measurements[index]!;

            return (
              <g key={measurement.id}>
                <title>
                  {t("measurements.body_weight.progress.point", {
                    date: DateFormat.plainDay(language, measurement.measuredOn),
                    weight: WeightFormat.kilograms(measurement.weight, BodyWeightDecimals),
                  })}
                </title>

                <circle className="chart-point" cx={point.x} cy={point.y} r="4" />

                <circle cx={point.x} cy={point.y} fill="transparent" r={POINT_HIT_RADIUS} />
              </g>
            );
          })}
        </g>
      </ui.LineChart>
    </div>
  );
}
