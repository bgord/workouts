import type * as tools from "@bgord/tools";
import type { DailySteps } from "./daily-steps";
import type { StepsCountType } from "./steps-count";

export type DailyStepsAverage = { average: StepsCountType; count: tools.IntegerPositiveType };

export type DailyStepsStats = {
  latest: DailySteps;
  previous?: DailySteps;
  week: DailyStepsAverage;
  month: DailyStepsAverage;
};
