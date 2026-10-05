import type { LoadStepStrategy } from "./load-step.strategy";

export class LoadStepLockedStrategy implements LoadStepStrategy {
  increase(): undefined {
    return undefined;
  }

  decrease(): undefined {
    return undefined;
  }
}
