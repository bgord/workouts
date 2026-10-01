import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { now } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import { createWorkout } from "../workouts";

export async function seedPocket(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.pocket.email);

  await draftPlan(di, userId, fixtures.pocket.plan);
  await finalizePlan(di, userId, fixtures.pocket.plan);

  await createWorkout(di, userId, {
    id: fixtures.pocket.scheduledWorkout.id,
    planId: fixtures.pocket.plan.id,
    planSectionId: fixtures.pocket.plan.sections.push.id,
    scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
  });

  console.log(`[✓] ${fixtures.pocket.email} plan finalized, workout scheduled without targets`);
}
