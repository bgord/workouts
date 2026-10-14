import * as tools from "@bgord/tools";
import * as v from "valibot";
import { StepsCountMax } from "./steps-count.validation";

export const DailyStepsGoalError = { Range: "daily.steps.goal.range" };

export const DailyStepsGoal = v.pipe(
  tools.IntegerPositive,
  v.check((value) => value <= StepsCountMax, DailyStepsGoalError.Range),
  // Stryker disable next-line StringLiteral
  v.brand("DailyStepsGoal"),
);
export type DailyStepsGoalType = v.InferOutput<typeof DailyStepsGoal>;
