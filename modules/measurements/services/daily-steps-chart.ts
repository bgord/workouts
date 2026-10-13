import * as tools from "@bgord/tools";
import * as VO from "+measurements/value-objects";
import { DailyStepsAverage } from "./daily-steps-average";

export class DailyStepsChart {
  constructor(private readonly entries: ReadonlyArray<VO.DailySteps>) {}

  points(granularity: VO.StepsChartGranularityType): ReadonlyArray<VO.StepsChartPoint> {
    const chronological = this.entries.toReversed();

    if (granularity === VO.StepsChartGranularityOptions.daily) {
      return chronological.map((entry) => ({
        from: entry.day,
        to: entry.day,
        steps: entry.count,
        count: tools.Int.positive(1),
      }));
    }

    const weeks = Map.groupBy(chronological, (entry) =>
      tools.Week.fromTimestamp(tools.Day.fromIsoId(entry.day).getStart()).toIsoId(),
    );

    return [...weeks.values()].map((week) => {
      const from = week[0]!.day;
      const to = week.at(-1)!.day;
      const { average, count } = new DailyStepsAverage(week, from, to).calculate()!;

      return { from, to, steps: average, count };
    });
  }
}
