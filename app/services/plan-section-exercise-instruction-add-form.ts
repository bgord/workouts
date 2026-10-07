import { ProgressionMethodOptions } from "../../modules/plans/value-objects/progression-method-options";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";

export const Form = {
  exerciseId: { field: { name: "exerciseId" } },
  query: { field: { name: "query" } },
  sets: { pattern: { min: 1, max: 20, step: 1 }, field: { name: "sets", defaultValue: 3 } },
  repsMin: { pattern: { min: 1, max: 100, step: 1 }, field: { name: "repsMin", defaultValue: 8 } },
  repsMax: { pattern: { min: 1, max: 100, step: 1 }, field: { name: "repsMax", defaultValue: 12 } },
  repsScheme: { field: { name: "repsScheme", defaultValue: RepsSchemeOptions.range } },
  progression: { field: { name: "progression", defaultValue: ProgressionMethodOptions.double_progression } },
};
