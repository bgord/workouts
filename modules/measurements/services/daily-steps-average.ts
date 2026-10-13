import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+measurements/value-objects";

export class DailyStepsAverage {
  private readonly rounding = new tools.RoundingToNearestStrategy();

  constructor(
    private readonly entries: ReadonlyArray<VO.DailySteps>,
    private readonly from: tools.DayIsoIdType,
    private readonly to: tools.DayIsoIdType,
  ) {}

  calculate(): VO.DailyStepsAverage | null {
    const within = this.entries.filter((entry) => entry.day >= this.from && entry.day <= this.to);

    if (within.length === 0) return null;

    const total = within.reduce((sum, entry) => sum + entry.count, 0);

    return {
      average: v.parse(VO.StepsCount, this.rounding.round(total / within.length)),
      count: tools.Int.positive(within.length),
    };
  }
}
