import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { now, withClock } from "../clock";
import type * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import { createWorkout, logSets, startWorkout, targetWorkout } from "../workouts";

export async function seedActive(di: BootstrapType, persona: typeof fixtures.active) {
  const userId = await createAccount(di, persona.email);
  const clock = new bg.ClockFixedAdapter(now.subtract(tools.Duration.Minutes(30)));

  await withClock(clock, async () => {
    await draftPlan(di, userId, persona.plan);
    await finalizePlan(di, userId, persona.plan);

    await di.Adapters.System.Sleeper.wait(tools.Duration.Ms(1));

    const workoutId = await createWorkout(di, userId, {
      id: persona.workout.id,
      planId: persona.plan.id,
      planSectionId: persona.plan.sections.push.id,
      scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
    });

    await targetWorkout(di, userId, workoutId, new Map());

    clock.advanceBy(tools.Duration.Minutes(5));
    await startWorkout(di, userId, workoutId);

    const [first, second] = (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).exercises;
    const firstTarget = first?.target;
    const secondTarget = second?.target;

    if (first === undefined || firstTarget === undefined) throw new Error("Missing first target");
    if (second === undefined || secondTarget === undefined) throw new Error("Missing second target");

    await logSets(
      di,
      userId,
      workoutId,
      first.id,
      Array.from({ length: firstTarget.sets }, () => ({
        reps: firstTarget.reps,
        load: firstTarget.load,
        rir: 2,
      })),
      clock,
    );

    await logSets(
      di,
      userId,
      workoutId,
      second.id,
      [{ reps: secondTarget.reps, load: secondTarget.load, rir: 2 }],
      clock,
    );
  });

  console.log(`[✓] ${persona.email} plan finalized, workout in progress`);
}
