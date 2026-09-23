// cspell:disable
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Statistics from "+statistics";
import * as Workouts from "+workouts";
import { workoutId, workoutScheduledFor } from "./workouts";

export const calculatedExercisePerformance = {
  workoutId,
  scheduledFor: workoutScheduledFor,
  sets: [
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 1),
      reps: v.parse(Workouts.VO.Reps, 5),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      rir: null,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 105_000),
    },
    {
      setNumber: v.parse(Workouts.VO.SetNumber, 2),
      reps: v.parse(Workouts.VO.Reps, 10),
      load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
      rir: null,
      estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120_000),
    },
  ],
  volume: v.parse(tools.WeightGrams, 1_350_000),
  bestSet: {
    setNumber: v.parse(Workouts.VO.SetNumber, 2),
    reps: v.parse(Workouts.VO.Reps, 10),
    load: v.parse(Workouts.VO.Load, tools.Weight.fromKilograms(90).get()),
    rir: null,
    estimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120_000),
  },
  bestEstimate: v.parse(Statistics.VO.OneRepMaxEstimate, 120_000),
};
