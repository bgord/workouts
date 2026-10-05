import type * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";

type Config = { step: tools.Weight };

export class LoadStepIncrementStrategy implements LoadStepStrategy {
  constructor(private readonly config: Config) {}

  increase(load: VO.LoadType): VO.LoadType {
    return v.parse(VO.Load, load + this.config.step.get());
  }

  decrease(load: VO.LoadType): VO.LoadType | undefined {
    if (load < this.config.step.get()) return undefined;

    return v.parse(VO.Load, load - this.config.step.get());
  }
}
