import * as bg from "@bgord/ui";
import * as BodyWeightChartForm from "../../app/services/body-weight-chart-form";
import { BodyWeightChartGranularityOptions } from "../../modules/measurements/value-objects/body-weight-chart-granularity-options";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { LineChartMath } from "../services/line-chart";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

const POINT_HIT_RADIUS = 8;

export function BodyWeightProgressChart() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { chart } = measurementsRoute.useLoaderData();
  const navigate = measurementsRoute.useNavigate();
  const search = measurementsRoute.useSearch();

  if (chart.length < LineChartMath.MINIMAL_POINTS) return null;

  const layout = LineChartMath.layout(
    chart.map((point) => WeightFormat.kilograms(point.weight, BodyWeightDecimals)),
    (weight) => t("measurements.body_weight.value", { weight }),
  );

  const reference = layout.points[chart.findIndex((point) => point.reference)];

  return (
    <div data-stack="y" data-variant="flat" {...ui.Gap.related}>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        <h2 data-grow="1">{t("measurements.body_weight.progress")}</h2>

        <ui.Select
          aria-label={t("measurements.body_weight.progress.granularity.label")}
          data-md-width="auto"
          data-width="auto"
          id={BodyWeightChartForm.Form.chart.field.name}
          name={BodyWeightChartForm.Form.chart.field.name}
          onChange={(event) => {
            const granularity = event.currentTarget.value as BodyWeightChartGranularityOptions;

            navigate({
              resetScroll: false,
              search: {
                month: search.month,
                chart: granularity === BodyWeightChartGranularityOptions.weekly ? undefined : granularity,
              },
              to: "/measurements",
            });
          }}
          value={search.chart ?? BodyWeightChartGranularityOptions.weekly}
          {...bg.Autocomplete.off}
        >
          <option value={BodyWeightChartGranularityOptions.weekly}>
            {t("measurements.body_weight.progress.granularity.weekly")}
          </option>

          <option value={BodyWeightChartGranularityOptions.daily}>
            {t("measurements.body_weight.progress.granularity.daily")}
          </option>
        </ui.Select>
      </div>

      <ui.LineChart aria-label={t("measurements.body_weight.progress")}>
        <ui.LineChartGrid
          end={DateFormat.plainDay(language, chart.at(-1)!.to)}
          layout={layout}
          start={DateFormat.plainDay(language, chart[0]!.from)}
        />

        {reference && (
          <g data-color="brand-300" stroke="currentColor" strokeDasharray="4 4">
            <title>{t("measurements.body_weight.stats.since_reference")}</title>

            <line x1={layout.plot.left} x2={layout.plot.right} y1={reference.y} y2={reference.y} />
            <line x1={reference.x} x2={reference.x} y1={layout.plot.top} y2={layout.plot.bottom} />
          </g>
        )}

        <ui.LineChartArea layout={layout} />

        <g
          className="chart-points"
          data-color="brand-300"
          fill="currentColor"
          stroke="transparent"
          strokeWidth={POINT_HIT_RADIUS}
        >
          {layout.points.map((coordinates, index) => {
            const point = chart[index]!;
            const weight = WeightFormat.kilograms(point.weight, BodyWeightDecimals);

            return (
              <circle cx={coordinates.x} cy={coordinates.y} key={index} r="4">
                <title>
                  {point.count === 1
                    ? t("measurements.body_weight.progress.point", {
                        date: DateFormat.plainDay(language, point.from),
                        weight,
                      })
                    : t("measurements.body_weight.progress.week", {
                        from: DateFormat.plainDay(language, point.from),
                        to: DateFormat.plainDay(language, point.to),
                        weight,
                        count: point.count,
                      })}
                </title>
              </circle>
            );
          })}
        </g>
      </ui.LineChart>
    </div>
  );
}
