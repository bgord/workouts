import type * as Plans from "+plans";
import type * as VO from "+workouts/value-objects";

type Config = { target: Plans.VO.RirTargetType | undefined; rir: VO.RirType | null | undefined };

export class RirBelowTarget {
  constructor(private readonly config: Config) {}

  calculate(): boolean {
    const { target, rir } = this.config;

    if (target === undefined || rir === undefined || rir === null) return false;

    return rir < target;
  }
}
