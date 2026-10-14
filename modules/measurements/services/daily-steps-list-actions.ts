import * as bg from "@bgord/bun";
import type * as VO from "+measurements/value-objects";

type DailyStepsListActionsFacts = { entries: ReadonlyArray<VO.DailySteps> };

export class DailyStepsListActions {
  constructor(private readonly facts: DailyStepsListActionsFacts) {}

  calculate(): { export: bg.ActionState } {
    return { export: bg.ActionState.of(this.facts.entries.length > 0) };
  }
}
