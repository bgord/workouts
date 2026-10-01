import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Measurements from "+measurements";
import * as Plans from "+plans";
import * as Workouts from "+workouts";
import type { BootstrapType } from "+infra/bootstrap";
import { createAccount } from "../account";
import { now, withClock } from "../clock";
import type * as fixtures from "../fixtures";
import { defineBodyPart, measureBodyPart, measureBodyWeight, setBodyWeightReference } from "../measurements";
import { draftPlan, finalizePlan } from "../plans";
import {
  completeWorkout,
  createWorkout,
  type ExerciseHistory,
  logSets,
  startWorkout,
  targetWorkout,
} from "../workouts";

const bodyWeightWobble = [0, 0.3, -0.2, 0.4, -0.1, 0.2, -0.3];

const bodyPartWobble = [0, 2, -1];

export async function seedAthlete(di: BootstrapType, persona: typeof fixtures.athlete) {
  const { push, pull, legs } = persona.plan.sections;

  const rotation = [push.id, pull.id, legs.id];

  const schedule = new Map([
    [1, push],
    [3, pull],
    [6, legs],
  ]);

  const bodyPartTrends = [
    { bodyPart: persona.bodyParts.waist, from: 820, to: 812 },
    { bodyPart: persona.bodyParts.chest, from: 1000, to: 1015 },
    { bodyPart: persona.bodyParts.armRight, from: 360, to: 368 },
    { bodyPart: persona.bodyParts.thighRight, from: 580, to: 590 },
  ];

  const userId = await createAccount(di, persona.email);

  await withClock(new bg.ClockFixedAdapter(now.subtract(tools.Duration.Weeks(9))), async () => {
    await draftPlan(di, userId, persona.plan);
    await finalizePlan(di, userId, persona.plan);
  });

  await Bun.sleep(tools.Duration.Ms(10).ms);

  const history: ExerciseHistory = new Map();
  let next = push.id;

  for (let daysAgo = 56; daysAgo >= 1; daysAgo--) {
    const day = tools.Day.fromTimestamp(now.subtract(tools.Duration.Days(daysAgo)));
    const section = schedule.get(day.getStart().toPlainDateUTC().dayOfWeek);

    if (section === undefined) continue;

    const clock = new bg.ClockFixedAdapter(day.getStart().add(tools.Duration.Hours(18)));
    const workoutId = v.parse(Workouts.VO.WorkoutId, di.Adapters.System.IdProvider.generate());

    await withClock(clock, async () => {
      await createWorkout(di, userId, {
        id: workoutId,
        planId: persona.plan.id,
        planSectionId: section.id,
        scheduledFor: day.toIsoId(),
      });

      await targetWorkout(di, userId, workoutId, history);

      clock.advanceBy(tools.Duration.Minutes(5));
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
          clock,
        );
      }

      clock.advanceBy(tools.Duration.Minutes(5));
      await completeWorkout(di, userId, workoutId);
    });

    for (const exercise of (await di.Adapters.Workouts.WorkoutRepository.load(workoutId)).exercises) {
      const sets = exercise.loggedSets.map((set) => ({ ...set, rir: set.rir ?? null }));

      history.set(exercise.exerciseId, [...(history.get(exercise.exerciseId) ?? []), { sets }]);
    }

    next = rotation[(rotation.indexOf(section.id) + 1) % rotation.length] ?? push.id;

    await Bun.sleep(tools.Duration.Ms(10).ms);
  }

  const referenceId = di.Adapters.System.IdProvider.generate();

  for (let daysAgo = 84; daysAgo >= 1; daysAgo--) {
    if (daysAgo % 7 === 4) continue;

    const trend = 78 + ((84 - daysAgo) / 84) * 2;
    const kilograms = trend + (bodyWeightWobble[daysAgo % bodyWeightWobble.length] ?? 0);

    await measureBodyWeight(di, userId, {
      id: daysAgo === 84 ? referenceId : di.Adapters.System.IdProvider.generate(),
      grams: Math.round(kilograms * 10) * 100,
      measuredOn: tools.Day.fromTimestamp(now.subtract(tools.Duration.Days(daysAgo))).toIsoId(),
    });
  }

  for (const bodyPart of Object.values(persona.bodyParts)) {
    await defineBodyPart(di, userId, bodyPart);
  }

  await Bun.sleep(tools.Duration.Ms(10).ms);

  await setBodyWeightReference(di, userId, {
    measurementId: referenceId,
    goal: Measurements.VO.BodyWeightGoalOptions.bulk,
  });

  for (const { bodyPart, from, to } of bodyPartTrends) {
    for (let weeksAgo = 12; weeksAgo >= 1; weeksAgo--) {
      const trend = Math.round(from + ((to - from) * (12 - weeksAgo)) / 11);

      await measureBodyPart(di, userId, {
        bodyPartId: bodyPart.id,
        millimeters: trend + (bodyPartWobble[weeksAgo % bodyPartWobble.length] ?? 0),
        measuredOn: tools.Day.fromTimestamp(now.subtract(tools.Duration.Weeks(weeksAgo))).toIsoId(),
      });
    }
  }

  await createWorkout(di, userId, {
    id: persona.scheduledWorkout.id,
    planId: persona.plan.id,
    planSectionId: next,
    scheduledFor: tools.Day.fromTimestamp(now).toIsoId(),
  });

  console.log(`[✓] ${persona.email} trained, measured, next workout scheduled`);
}
