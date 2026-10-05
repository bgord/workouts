import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { WeightFormat } from "../services/weight-format";

type LoadingFormatStrategy = {
  set: (load: number, language: string) => string | null;
  target: (load: number, language: string) => string | null;
  report: (load: number) => string;
};

const kilograms = (load: number, language: string) =>
  `${WeightFormat.kilograms(load).toLocaleString(language)} kg`;

export const LoadingFormat = {
  [ExerciseLoadingOptions.external]: {
    set: (load, language) => `×${kilograms(load, language)}`,
    target: kilograms,
    report: (load) => String(WeightFormat.kilograms(load)),
  },
  [ExerciseLoadingOptions.none]: {
    set: () => null,
    target: () => null,
    report: () => "—",
  },
} satisfies Record<ExerciseLoadingOptions, LoadingFormatStrategy>;
