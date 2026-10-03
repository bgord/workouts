import type * as bg from "@bgord/ui";
import { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { WeightFormat } from "../services/weight-format";

type Translate = ReturnType<typeof bg.useTranslations>;

type LoadingFormatStrategy = {
  repsLoad: (t: Translate, language: string, value: { reps: string; load: number }) => string;
  setsRepsLoad: (
    t: Translate,
    language: string,
    value: { sets: number; reps: string; load: number },
  ) => string;
  report: (load: number) => string;
};

export const LoadingFormat = {
  [ExerciseLoadingOptions.external]: {
    repsLoad: (t, language, value) =>
      t("exercise.reps_load", {
        reps: value.reps,
        load: WeightFormat.kilograms(value.load).toLocaleString(language),
      }),
    setsRepsLoad: (t, language, value) =>
      t("exercise.sets_reps_load", {
        sets: value.sets,
        reps: value.reps,
        load: WeightFormat.kilograms(value.load).toLocaleString(language),
      }),
    report: (load) => String(WeightFormat.kilograms(load)),
  },
} satisfies Record<ExerciseLoadingOptions, LoadingFormatStrategy>;
