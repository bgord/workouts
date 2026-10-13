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

    return {
      latest,
      previous: this.entries[1],
      week: this.average(latest.day, WEEK_WINDOW_DAYS),
      month: this.average(latest.day, MONTH_WINDOW_DAYS),
    };
  }

  private average(anchor: VO.StepsDayType, days: number): VO.DailyStepsAverage {
    const from = Temporal.PlainDate.from(anchor)
      .subtract({ days: days - 1 })
      .toString();

    const within = this.entries.filter((entry) => entry.day >= from && entry.day <= anchor);
    const total = within.reduce((sum, entry) => sum + entry.count, 0);

    return {
      average: v.parse(VO.StepsCount, this.rounding.round(total / within.length)),
      count: tools.Int.positive(within.length),
    };
  }
}
