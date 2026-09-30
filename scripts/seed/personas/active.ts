import * as tools from "@bgord/tools";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { advanceClockBy, moveClockTo, now } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import { createWorkout, logSets, startWorkout, targetWorkout } from "../workouts";

export async function seedActive(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.active.email);

  await draftPlan(di, userId, fixtures.active.plan);
  await finalizePlan(di, userId, fixtures.active.plan);

  await Bun.sleep(tools.Duration.Ms(10).ms);

  moveClockTo(now.subtract(tools.Duration.Minutes(30)));

  const workoutId = await createWorkout(di, userId, {
    id: fixtures.active.workout.id,
    planId: fixtures.active.plan.id,
    planSectionId: fixtures.active.plan.sections.push.id,
    scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
  });

  await targetWorkout(di, userId, workoutId, new Map());

  advanceClockBy(tools.Duration.Minutes(5));
  await startWorkout(di, userId, workoutId);

  const [first, second] = (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).exercises;
  const firstTarget = first?.target;
  const secondTarget = second?.target;

  if (first === undefined || firstTarget === undefined) throw new Error("Active workout has no first target");
  if (second === undefined || secondTarget === undefined) throw new Error("Active workout has no second target");

  await logSets(
    di,
    userId,
    workoutId,
    first.id,
    Array.from({ length: firstTarget.sets }, () => ({ reps: firstTarget.reps, load: firstTarget.load, rir: 2 })),
  );

  await logSets(di, userId, workoutId, second.id, [
    { reps: secondTarget.reps, load: secondTarget.load, rir: 2 },
  ]);

  console.log(`[✓] ${fixtures.active.email} plan finalized, workout in progress`);
}
