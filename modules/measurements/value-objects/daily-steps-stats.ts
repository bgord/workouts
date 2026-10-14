import type * as tools from "@bgord/tools";
import type { DailySteps } from "./daily-steps";
import type { StepsCountType } from "./steps-count";

export type DailyStepsStats = {
  latest: DailySteps;
  previous?: DailySteps;
  week: { average: StepsCountType; count: tools.IntegerPositiveType };
  previousWeek?: { average: StepsCountType };
  month: { average: StepsCountType; count: tools.IntegerPositiveType };
  previousMonth?: { average: StepsCountType };
};
