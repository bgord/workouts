import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { now, withClock } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import { completeWorkout, createWorkout, logSets, startWorkout, targetWorkout } from "../workouts";

export async function seedHanger(di: BootstrapType) {
  const persona = fixtures.hanger;
  const userId = await createAccount(di, persona.email);

  await withClock(new bg.ClockFixedAdapter(now.subtract(tools.Duration.Days(3))), async () => {
    await draftPlan(di, userId, persona.plan);
    await finalizePlan(di, userId, persona.plan);
  });

  await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

  const day = tools.Day.fromTimestamp(now.subtract(tools.Duration.Days(2)));
  const clock = new bg.ClockFixedAdapter(day.getStart().add(tools.Duration.Hours(18)));

  await withClock(clock, async () => {
    const workoutId = await createWorkout(di, userId, {
      id: persona.completedWorkout.id,
      planId: persona.plan.id,
      planSectionId: persona.plan.sections.core.id,
      scheduledFor: day.toIsoId(),
    });

    await targetWorkout(di, userId, workoutId, new Map());

    clock.advanceBy(tools.Duration.Minutes(5));
    await startWorkout(di, userId, workoutId);

    const [exercise] = (await di.Adapters.Workouts.WorkoutRepository.load(workoutId))["exercises"];

    if (exercise === undefined) throw new Error("Missing exercise");

    await logSets(
      di,
      userId,
      workoutId,
      exercise.id,
      Array.from({ length: 3 }, () => ({ reps: 15, load: 0, rir: 1 })),
      clock,
    );

    clock.advanceBy(tools.Duration.Minutes(5));
    await completeWorkout(di, userId, workoutId);
  });

  await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

  await createWorkout(di, userId, {
    id: persona.scheduledWorkout.id,
    planId: persona.plan.id,
    planSectionId: persona.plan.sections.core.id,
    scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
  });

  console.log(`[✓] ${persona.email} trained once at the top of the range, next workout scheduled`);
}
