import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { now, withClock } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import { createWorkout } from "../workouts";

export async function seedLapsed(di: BootstrapType) {
  const persona = fixtures.lapsed;
  const userId = await createAccount(di, persona.email);

  await withClock(new bg.ClockFixedAdapter(now.subtract(tools.Duration.Days(11))), async () => {
    await draftPlan(di, userId, persona.plan);
    await finalizePlan(di, userId, persona.plan);

    await createWorkout(di, userId, {
      id: persona.scheduledWorkout.id,
      planId: persona.plan.id,
      planSectionId: persona.plan.sections.core.id,
      scheduledFor: tools.Day.fromTimestamp(now.subtract(tools.Duration.Days(10))).toIsoId(),
    });
  });

  console.log(`[✓] ${persona.email} plan finalized, workout scheduled outside the last week`);
}
