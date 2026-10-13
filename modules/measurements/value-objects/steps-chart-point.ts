import type * as tools from "@bgord/tools";
import type { StepsCountType } from "./steps-count";
import type { StepsDayType } from "./steps-day";

export type StepsChartPoint = {
  from: StepsDayType;
  to: StepsDayType;
  steps: StepsCountType;
  count: tools.IntegerPositiveType;
};
