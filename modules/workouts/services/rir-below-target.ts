import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

type Config = { target: Plans.VO.RirTargetType | undefined; effort: VO.RirType | null | undefined };

export class RirBelowTarget {
  constructor(private readonly config: Config) {}

  calculate(): boolean {
    const { target, effort } = this.config;

    if (target === undefined || effort === undefined || effort === null) return false;

    return effort < target;
  }
}
