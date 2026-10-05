import { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { WeightFormat } from "../services/weight-format";

type ResistanceFormatStrategy = {
  set: (load: number, language: string) => string | null;
  target: (load: number, language: string) => string | null;
  report: (load: number) => string;
};

const kilograms = (load: number, language: string) =>
  `${WeightFormat.kilograms(load).toLocaleString(language)} kg`;

export const ResistanceFormat = {
  [ExerciseResistanceOptions.weighted]: {
    set: (load, language) => `×${kilograms(load, language)}`,
    target: kilograms,
    report: (load) => String(WeightFormat.kilograms(load)),
  },
  [ExerciseResistanceOptions.bodyweight]: {
    set: () => null,
    target: () => null,
    report: () => "—",
  },
} satisfies Record<ExerciseResistanceOptions, ResistanceFormatStrategy>;
