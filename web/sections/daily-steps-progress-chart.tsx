import * as bg from "@bgord/ui";
import { X } from "lucide-react";
import * as DailyStepsChartForm from "../../app/services/daily-steps-chart-form";
import { StepsChartGranularityOptions } from "../../modules/measurements/value-objects/steps-chart-granularity-options";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";
import { LineChartMath } from "../services/line-chart";

const POINT_HIT_RADIUS = 8;
const STEPS_IN_THOUSAND = 1000;

export function DailyStepsProgressChart() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const format = bg.useDateFormat();
  const { chart } = dailyStepsRoute.useLoaderData();
  const navigate = dailyStepsRoute.useNavigate();
  const search = dailyStepsRoute.useSearch();

  if (chart.length < LineChartMath.MINIMAL_POINTS) return null;

  const layout = LineChartMath.layout(
    chart.map((point) => point.steps / STEPS_IN_THOUSAND),
    (thousands) => (thousands * STEPS_IN_THOUSAND).toLocaleString(language),
  );

  const pristine = DailyStepsChartForm.Form.isDefault(search);

  return (
    <div data-stack="y" {...ui.Gap.related}>
      <h2>{t("measurements.daily_steps.progress")}</h2>

      <div data-stack="x" {...ui.Gap.cluster}>
        <ui.Select
          aria-label={t("measurements.daily_steps.progress.granularity.label")}
          id={DailyStepsChartForm.Form.chart.field.name}
          name={DailyStepsChartForm.Form.chart.field.name}
          onChange={(event) => {
            const granularity = event.currentTarget.value as StepsChartGranularityOptions;

            navigate({
              resetScroll: false,
              search: {
                month: search.month,
                chart: granularity === StepsChartGranularityOptions.weekly ? undefined : granularity,
              },
              to: "/measurements/daily-steps",
            });
          }}
          value={search.chart ?? StepsChartGranularityOptions.weekly}
          {...bg.Autocomplete.off}
        >
          <option value={StepsChartGranularityOptions.weekly}>
            {t("measurements.daily_steps.progress.granularity.weekly")}
          </option>

          <option value={StepsChartGranularityOptions.daily}>
            {t("measurements.daily_steps.progress.granularity.daily")}
          </option>
        </ui.Select>

        <ui.IconButton
          aria-label={t("app.clear")}
          data-disp={pristine ? "none" : "flex"}
          data-md-disp="flex"
          disabled={pristine}
          onClick={() =>
            navigate({ resetScroll: false, search: { month: search.month }, to: "/measurements/daily-steps" })
          }
          title={t("app.clear")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      <ui.LineChart
        aria-label={t("measurements.daily_steps.progress")}
        end={format.full(chart.at(-1)!.to)}
        layout={layout}
        start={format.full(chart[0]!.from)}
      >
        <ui.LineChartArea layout={layout} />

        <g data-color="brand-300" fill="currentColor" stroke="transparent" strokeWidth={POINT_HIT_RADIUS}>
          {layout.points.map((coordinates, index) => {
            const point = chart[index]!;
            const steps = t("measurements.daily_steps.value", {
              count: point.steps.toLocaleString(language),
            });

            return (
              <circle
                cx={coordinates.x}
                cy={coordinates.y}
                data-hover-opacity="full"
                data-opacity="none"
                key={index}
                r="4"
              >
                <title>
                  {point.count === 1
                    ? t("measurements.daily_steps.progress.point", { date: format.full(point.from), steps })
                    : t("measurements.daily_steps.progress.week", {
                        range: format.range(point.from, point.to),
                        steps,
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
