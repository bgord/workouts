import * as tools from "@bgord/tools";
import * as Plans from "+plans";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { advanceClockBy, moveClockTo, now } from "../clock";
import * as fixtures from "../fixtures";
import { draftPlan, finalizePlan } from "../plans";
import {
  completeWorkout,
  createWorkout,
  type ExerciseHistory,
  logSets,
  startWorkout,
  targetWorkout,
} from "../workouts";

const { push, pull, legs } = fixtures.athlete.plan.sections;

const rotation = [push.id, pull.id, legs.id];

const schedule = new Map([
  [1, push],
  [3, pull],
  [6, legs],
]);

export async function seedAthlete(di: BootstrapType) {
  const userId = await createAccount(di, fixtures.athlete.email);

  await draftPlan(di, userId, fixtures.athlete.plan);
  await finalizePlan(di, userId, fixtures.athlete.plan);

  await Bun.sleep(tools.Duration.Ms(10).ms);

  const history: ExerciseHistory = new Map();
  let next = push.id;

  for (let daysAgo = 56; daysAgo >= 1; daysAgo--) {
    const day = tools.Day.fromTimestamp(now.subtract(tools.Duration.Days(daysAgo)));
    const section = schedule.get(day.getStart().toPlainDateUTC().dayOfWeek);

    if (section === undefined) continue;

    moveClockTo(day.getStart().add(tools.Duration.Hours(18)));

    const workoutId = await createWorkout(di, userId, {
      id: di.Adapters.System.IdProvider.generate(),
      planId: fixtures.athlete.plan.id,
      planSectionId: section.id,
      scheduledFor: day.toIsoId(),
    });

    await targetWorkout(di, userId, workoutId, history);

    advanceClockBy(tools.Duration.Minutes(5));
    await startWorkout(di, userId, workoutId);

    for (const exercise of (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).exercises) {
      const target = exercise.target;

      if (target === undefined) continue;

      const sessions = history.get(exercise.exerciseId) ?? [];
      const stall =
        exercise.prescription.progression === Plans.VO.ProgressionMethodOptions.double_progression &&
        sessions.length % 4 === 3;

      await logSets(
        di,
        userId,
        workoutId,
        exercise.id,
        Array.from({ length: target.sets }, (_, index) => ({
          reps: stall && index === target.sets - 1 ? target.reps - 1 : target.reps,
          load: target.load,
          rir: index < target.sets / 2 ? 2 : 1,
        })),
      );
    }

    advanceClockBy(tools.Duration.Minutes(5));
    await completeWorkout(di, userId, workoutId);

    for (const exercise of (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).exercises) {
      const sets = exercise.loggedSets.map((set) => ({ ...set, rir: set.rir ?? null }));

      history.set(exercise.exerciseId, [...(history.get(exercise.exerciseId) ?? []), { sets }]);
    }

    next = rotation[(rotation.indexOf(section.id) + 1) % rotation.length] ?? push.id;

    await Bun.sleep(tools.Duration.Ms(10).ms);
  }

  moveClockTo(now.subtract(tools.Duration.Hours(1)));

  await createWorkout(di, userId, {
    id: fixtures.athlete.scheduledWorkout.id,
    planId: fixtures.athlete.plan.id,
    planSectionId: next,
    scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
  });

  console.log(`[✓] ${fixtures.athlete.email} plan finalized, workout history completed, next workout scheduled`);
}
