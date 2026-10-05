import type { LoadStepStrategy } from "./load-step.strategy";

export class LoadStepLockedStrategy implements LoadStepStrategy {
  // Stryker disable next-line BlockStatement
  increase(): undefined {
    return undefined;
  }

  // Stryker disable next-line BlockStatement
  decrease(): undefined {
    return undefined;
  }
}
