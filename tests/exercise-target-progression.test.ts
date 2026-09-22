import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";

const target = v.parse(Workouts.VO.ExerciseTarget, {
  sets: v.parse(Workouts.VO.Sets, 1),
  reps: v.parse(Workouts.VO.Reps, 5),
  load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
});

describe("ExerciseTargetProgression", () => {
  test("happened - load up", () => {
    const progression = new Workouts.Services.ExerciseTargetProgression(
      target,
      v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(85).get()),
      }),
    );

    expect(progression.happened()).toEqual(true);
  });

  test("happened - reps up at the same load", () => {
    const progression = new Workouts.Services.ExerciseTargetProgression(
      target,
      v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    );

    expect(progression.happened()).toEqual(true);
  });

  test("happened - reps up at a lower load", () => {
    const progression = new Workouts.Services.ExerciseTargetProgression(
      target,
      v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 1),
        reps: v.parse(Workouts.VO.Reps, 6),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(75).get()),
      }),
    );

    expect(progression.happened()).toEqual(false);
  });

  test("happened - the same target", () => {
    const progression = new Workouts.Services.ExerciseTargetProgression(target, target);

    expect(progression.happened()).toEqual(false);
  });

  test("happened - more sets alone is not progress", () => {
    const progression = new Workouts.Services.ExerciseTargetProgression(
      target,
      v.parse(Workouts.VO.ExerciseTarget, {
        sets: v.parse(Workouts.VO.Sets, 3),
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(80).get()),
      }),
    );

    expect(progression.happened()).toEqual(false);
  });
});
