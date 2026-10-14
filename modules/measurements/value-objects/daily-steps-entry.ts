import type { DailySteps } from "./daily-steps";

export type DailyStepsEntry = DailySteps & { belowGoal: boolean };
