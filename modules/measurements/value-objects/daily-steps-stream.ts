import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Auth from "+auth";
import type { DailyStepsDayType } from "./daily-steps-day";

export const DailyStepsStream = {
  of: (userId: Auth.VO.UserIdType, day: DailyStepsDayType) =>
    v.parse(bg.EventStream, `daily_steps_${userId}_${day}`),
};
