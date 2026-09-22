import * as bg from "@bgord/bun";
import type * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Auth from "+auth";

export const WeeklySummaryStream = {
  of: (userId: Auth.VO.UserIdType, weekIsoId: tools.WeekIsoIdType) =>
    v.parse(bg.EventStream, `weekly_summary_${userId}_${weekIsoId}`),
};
