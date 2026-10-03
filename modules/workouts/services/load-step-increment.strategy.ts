import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";

export class LoadStepIncrementStrategy implements LoadStepStrategy {
  constructor(private readonly step = tools.Weight.fromKilograms(2.5)) {}

  increase(load: VO.LoadType): VO.LoadType {
    return v.parse(VO.Load, load + this.step.get());
  }

  decrease(load: VO.LoadType): VO.LoadType | undefined {
    if (load < this.step.get()) return undefined;

    return v.parse(VO.Load, load - this.step.get());
  }
}
