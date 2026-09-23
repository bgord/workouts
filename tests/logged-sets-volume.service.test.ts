import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Workouts from "+workouts";

describe("LoggedSetsVolume", () => {
  test("calculate - no sets", () => {
    const volume = new Workouts.Services.LoggedSetsVolume([]);

    expect(volume.calculate().get()).toEqual(v.parse(tools.WeightGrams, 0));
  });

  test("calculate - a single set", () => {
    const volume = new Workouts.Services.LoggedSetsVolume([
      {
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
      },
    ]);

    expect(volume.calculate().get()).toEqual(
      v.parse(tools.WeightGrams, tools.Weight.fromKilograms(500).get()),
    );
  });

  test("calculate - sets of different reps and loads", () => {
    const volume = new Workouts.Services.LoggedSetsVolume([
      {
        reps: v.parse(Workouts.VO.Reps, 5),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(100).get()),
      },
      {
        reps: v.parse(Workouts.VO.Reps, 8),
        load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(60).get()),
      },
    ]);

    expect(volume.calculate().toKilograms()).toEqual(980);
  });
});
