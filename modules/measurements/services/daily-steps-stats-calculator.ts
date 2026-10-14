import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+measurements/value-objects";
import { DailyStepsAverage } from "./daily-steps-average";

const WEEK_WINDOW_DAYS = 7;
const MONTH_WINDOW_DAYS = 30;

export class DailyStepsStatsCalculator {
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

  private average(anchor: VO.DailyStepsDayType, offset: number, days: number) {
    const date = Temporal.PlainDate.from(anchor);
    const from = v.parse(tools.DayIsoId, date.subtract({ days: offset + days - 1 }).toString());
    const to = v.parse(tools.DayIsoId, date.subtract({ days: offset }).toString());

    return new DailyStepsAverage(this.entries, from, to).calculate();
  }
}
