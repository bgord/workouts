import type * as bg from "@bgord/ui";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { ResistanceFormat } from "../kits/resistance.format";
import { EffortFormat } from "./effort-format";

type SetFigures = { reps: number; load: number };

const join = (separator: string, parts: ReadonlyArray<string | null>) =>
  parts.filter((part) => part !== null).join(separator);

export const SetNotation = {
  set: (language: string, value: { resistance: ExerciseResistanceOptions } & SetFigures) =>
    join("", [EffortFormat.set(value.reps), ResistanceFormat[value.resistance].set(value.load, language)]),

  target: (
    t: bg.TranslateType,
    language: string,
    value: { resistance: ExerciseResistanceOptions; sets: number } & SetFigures,
  ) =>
    join(" ", [
      EffortFormat.target(t, value.sets, value.reps),
      ResistanceFormat[value.resistance].target(value.load, language),
    ]),

  performance: (
    t: bg.TranslateType,
    language: string,
    value: { resistance: ExerciseResistanceOptions; sets: ReadonlyArray<SetFigures> },
  ) => {
    const reps = value.sets.map((set) => set.reps);
    const load = Math.min(...value.sets.map((set) => set.load));
    const uniform = reps.every((count) => count === reps[0]);

    if (uniform) {
      return SetNotation.target(t, language, {
        resistance: value.resistance,
        sets: value.sets.length,
        reps: reps[0] ?? 0,
        load,
      });
    }

    return join("", [EffortFormat.performance(reps), ResistanceFormat[value.resistance].set(load, language)]);
  },
};
