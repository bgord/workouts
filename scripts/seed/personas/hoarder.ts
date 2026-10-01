import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { now, withClock } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, enablePlanEditing, finalizePlan } from "../plans";
import { createWorkout, startWorkout, targetWorkout } from "../workouts";

export async function seedHoarder(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.hoarder.email);
  const clock = new bg.ClockFixedAdapter(now.subtract(tools.Duration.Minutes(30)));

  await withClock(clock, async () => {
    await draftPlan(di, userId, fixtures.hoarder.plan);
    await finalizePlan(di, userId, fixtures.hoarder.plan);

    await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

    const activeWorkoutId = await createWorkout(di, userId, {
      id: fixtures.hoarder.activeWorkout.id,
      planId: fixtures.hoarder.plan.id,
      planSectionId: fixtures.hoarder.plan.sections.everything.id,
      scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
    });

    await targetWorkout(di, userId, activeWorkoutId, new Map());

    clock.advanceBy(tools.Duration.Minutes(5));
    await startWorkout(di, userId, activeWorkoutId);

    const todayId = await createWorkout(di, userId, {
      id: fixtures.hoarder.draftWorkouts.today.id,
      planId: fixtures.hoarder.plan.id,
      planSectionId: fixtures.hoarder.plan.sections.one.id,
      scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
    });

    await targetWorkout(di, userId, todayId, new Map());

    await createWorkout(di, userId, {
      id: fixtures.hoarder.draftWorkouts.tomorrow.id,
      planId: fixtures.hoarder.plan.id,
      planSectionId: fixtures.hoarder.plan.sections.one.id,
      scheduledFor: tools.Day.fromTimestamp(now.add(tools.Duration.Days(1))).toIsoId(),
    });

    await createWorkout(di, userId, {
      id: fixtures.hoarder.draftWorkouts.dayAfter.id,
      planId: fixtures.hoarder.plan.id,
      planSectionId: fixtures.hoarder.plan.sections.one.id,
      scheduledFor: tools.Day.fromTimestamp(now.add(tools.Duration.Days(2))).toIsoId(),
    });

    await enablePlanEditing(di, userId, fixtures.hoarder.plan);
  });

  console.log(`[✓] ${fixtures.hoarder.email} plan at the limits, workout in progress, 3 drafts`);
}
