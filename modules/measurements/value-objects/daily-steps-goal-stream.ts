import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Auth from "+auth";

export const DailyStepsGoalStream = {
  of: (userId: Auth.VO.UserIdType) => v.parse(bg.EventStream, `daily_steps_goal_${userId}`),
};
