import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as VO from "+measurements/value-objects";
import { BodyPartAverage } from "./body-part-average";

const ROLLING_WINDOW_DAYS = 7;

export class BodyPartStatsCalculator {
  constructor(private readonly measurements: ReadonlyArray<VO.BodyPartMeasurement>) {}

  calculate(): VO.BodyPartStats | null {
    const latest = this.measurements[0];
    const baseline = this.measurements.at(-1);

    if (!(latest && baseline)) return null;

    const anchor = Temporal.PlainDate.from(latest.measuredOn);

    const week = new BodyPartAverage(
      this.measurements,
      v.parse(tools.DayIsoId, anchor.subtract({ days: ROLLING_WINDOW_DAYS - 1 }).toString()),
      latest.measuredOn,
    ).calculate();

    const previousWeek = new BodyPartAverage(
      this.measurements,
      v.parse(tools.DayIsoId, anchor.subtract({ days: ROLLING_WINDOW_DAYS * 2 - 1 }).toString()),
      v.parse(tools.DayIsoId, anchor.subtract({ days: ROLLING_WINDOW_DAYS }).toString()),
    ).calculate();

    return {
      latest,
      previous: this.measurements[1],
      baseline,
      week: week ?? { average: latest.value, count: 1 },
      previousWeek: previousWeek ? { average: previousWeek.average } : undefined,
    };
  }
}
