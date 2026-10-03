import * as tools from "@bgord/tools";
import * as Auth from "+auth";
import type { BootstrapType } from "+infra/bootstrap";
import { now } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import { createWorkout } from "../workouts";

export async function seedAdmin(di: BootstrapType) {
  await draftPlan(di, Auth.VO.ADMIN_USER_ID, fixtures.admin.plan);
  await finalizePlan(di, Auth.VO.ADMIN_USER_ID, fixtures.admin.plan);

  await createWorkout(di, Auth.VO.ADMIN_USER_ID, {
    id: fixtures.admin.scheduledWorkout.id,
    planId: fixtures.admin.plan.id,
    planSectionId: fixtures.admin.plan.sections.fullBody.id,
    scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
  });

  console.log(`[✓] ${fixtures.admin.email} plan finalized, workout scheduled`);
}
