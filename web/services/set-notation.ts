import type * as bg from "@bgord/ui";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import { EffortFormat } from "../kits/effort.format";
import { LoadingFormat } from "../kits/loading.format";

type Translate = ReturnType<typeof bg.useTranslations>;

type SetFigures = { reps: number; load: number };

const join = (separator: string, parts: ReadonlyArray<string | null>) =>
  parts.filter((part) => part !== null).join(separator);

export const SetNotation = {
  set: (language: string, value: { loading: ExerciseLoadingOptions } & SetFigures) =>
    join("", [EffortFormat.set(value.reps), LoadingFormat[value.loading].set(value.load, language)]),

  target: (
    t: Translate,
    language: string,
    value: { loading: ExerciseLoadingOptions; sets: number } & SetFigures,
  ) =>
    join(" ", [
      EffortFormat.target(t, value.sets, value.reps),
      LoadingFormat[value.loading].target(value.load, language),
    ]),

  performance: (
    t: Translate,
    language: string,
    value: { loading: ExerciseLoadingOptions; sets: ReadonlyArray<SetFigures> },
  ) => {
    const reps = value.sets.map((set) => set.reps);
    const load = Math.min(...value.sets.map((set) => set.load));
    const uniform = reps.every((count) => count === reps[0]);

    if (uniform) {
      return SetNotation.target(t, language, {
        loading: value.loading,
        sets: value.sets.length,
        reps: reps[0] ?? 0,
        load,
      });
    }

    return join("", [EffortFormat.performance(reps), LoadingFormat[value.loading].set(load, language)]);
  },
};
