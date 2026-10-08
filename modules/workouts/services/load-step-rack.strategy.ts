import type * as tools from "@bgord/tools";
import * as v from "valibot";
import * as VO from "+workouts/value-objects";
import type { LoadStepStrategy } from "./load-step.strategy";

type Config = { rack: ReadonlyArray<tools.Weight> };

export class LoadStepRackStrategy implements LoadStepStrategy {
  constructor(private readonly config: Config) {}

  increase(load: VO.LoadType): VO.LoadType | undefined {
    const next = this.config.rack.find((weight) => weight.get() > load);

    if (next === undefined) return undefined;

    return v.parse(VO.Load, next.get());
  }

  decrease(load: VO.LoadType): VO.LoadType | undefined {
    const previous = this.config.rack.findLast((weight) => weight.get() < load);

    if (previous === undefined) return undefined;

    return v.parse(VO.Load, previous.get());
  }
}
