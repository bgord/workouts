import * as v from "valibot";
import * as VO from "+stats/value-objects";

class DeltaCalculatorFactory {
  between(current: number | undefined, previous: number | undefined): VO.DeltaType | undefined {
    if (current === undefined || previous === undefined) return undefined;

    return v.parse(VO.Delta, current - previous);
  }
}

export const DeltaCalculator = new DeltaCalculatorFactory();
