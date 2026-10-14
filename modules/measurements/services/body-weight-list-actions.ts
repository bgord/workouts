import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

type BodyWeightListActionsFacts = { measurements: ReadonlyArray<VO.BodyWeightMeasurement> };

export class BodyWeightListActions {
  constructor(private readonly facts: BodyWeightListActionsFacts) {}

  calculate(): { export: bg.ActionState } {
    return { export: bg.ActionState.of(this.facts.measurements.length > 0) };
  }
}
