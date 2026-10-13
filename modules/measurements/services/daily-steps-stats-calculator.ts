import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";

const WEEK_WINDOW_DAYS = 7;
const MONTH_WINDOW_DAYS = 30;

export class DailyStepsStatsCalculator {
  private readonly rounding = new tools.RoundingToNearestStrategy();

  constructor(private readonly entries: ReadonlyArray<VO.DailySteps>) {}

  calculate(): VO.DailyStepsStats | null {
    const latest = this.entries[0];

    if (!latest) return null;

    const week = this.average(latest.day, 0, WEEK_WINDOW_DAYS);
    const previousWeek = this.average(latest.day, WEEK_WINDOW_DAYS, WEEK_WINDOW_DAYS);
    const month = this.average(latest.day, 0, MONTH_WINDOW_DAYS);
    const previousMonth = this.average(latest.day, MONTH_WINDOW_DAYS, MONTH_WINDOW_DAYS);

    return {
      latest,
      previous: this.entries[1],
      week: week ?? { average: latest.count, count: tools.Int.positive(1) },
      previousWeek: previousWeek ? { average: previousWeek.average } : undefined,
      month: month ?? { average: latest.count, count: tools.Int.positive(1) },
      previousMonth: previousMonth ? { average: previousMonth.average } : undefined,
    };
  }

  private average(anchor: VO.StepsDayType, offset: number, days: number): VO.DailyStepsAverage | null {
    const date = Temporal.PlainDate.from(anchor);
    const from = date.subtract({ days: offset + days - 1 }).toString();
    const to = date.subtract({ days: offset }).toString();

    const within = this.entries.filter((entry) => entry.day >= from && entry.day <= to);

    if (within.length === 0) return null;

    const total = within.reduce((sum, entry) => sum + entry.count, 0);

    return {
      average: v.parse(VO.StepsCount, this.rounding.round(total / within.length)),
      count: tools.Int.positive(within.length),
    };
  }
}
