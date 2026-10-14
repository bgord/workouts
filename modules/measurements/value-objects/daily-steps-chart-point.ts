import type * as tools from "@bgord/tools";
import type { DailyStepsDayType } from "./daily-steps-day";
import type { StepsCountType } from "./steps-count";

export type DailyStepsChartPoint = {
  from: DailyStepsDayType;
  to: DailyStepsDayType;
  steps: StepsCountType;
  count: tools.IntegerPositiveType;
};
