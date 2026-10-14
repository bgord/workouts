import type * as VO from "+measurements/value-objects";

type Config = { goal: VO.DailyStepsGoalType | null; count: VO.StepsCountType };

export class DailyStepsBelowGoal {
  constructor(private readonly config: Config) {}

  calculate(): boolean {
    const { goal, count } = this.config;

    if (goal === null) return false;

    return count < goal;
  }
}
