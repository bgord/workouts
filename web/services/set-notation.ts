import type * as bg from "@bgord/ui";
import type { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import { RepsSchemeOptions } from "../../modules/plans/value-objects/reps-scheme-options";
import { LateralityFormat } from "../kits/laterality.format";
import { RepsSchemeFormat } from "../kits/reps-scheme.format";
import { ResistanceFormat } from "../kits/resistance.format";
import { EffortFormat } from "./effort-format";

type SetFigures = { reps: number; load: number };

type SetAxes = { resistance: ExerciseResistanceOptions; laterality: ExerciseLateralityOptions };

const join = (separator: string, parts: ReadonlyArray<string | null>) =>
  parts.filter((part) => part !== null).join(separator);

export const SetNotation = {
  set: (t: bg.TranslateType, language: string, value: SetAxes & SetFigures) =>
    join(" ", [
      join("", [EffortFormat.set(value.reps), ResistanceFormat[value.resistance].set(value.load, language)]),
      LateralityFormat[value.laterality].suffix(t),
    ]),

  target: (
    t: bg.TranslateType,
    language: string,
    value: SetAxes & { scheme: RepsSchemeOptions; sets: number } & SetFigures,
  ) =>
    join(" ", [
      EffortFormat.target(t, value.sets, RepsSchemeFormat[value.scheme].target(value.reps)),
      ResistanceFormat[value.resistance].target(value.load, language),
      LateralityFormat[value.laterality].suffix(t),
    ]),

  performance: (
    t: bg.TranslateType,
    language: string,
    value: SetAxes & { sets: ReadonlyArray<SetFigures> },
  ) => {
    const reps = value.sets.map((set) => set.reps);
    const load = Math.min(...value.sets.map((set) => set.load));
    const uniform = reps.every((count) => count === reps[0]);

    if (uniform) {
      return SetNotation.target(t, language, {
        resistance: value.resistance,
        laterality: value.laterality,
        scheme: RepsSchemeOptions.range,
        sets: value.sets.length,
        reps: reps[0] ?? 0,
        load,
      });
    }

    return join(" ", [
      join("", [EffortFormat.performance(reps), ResistanceFormat[value.resistance].set(load, language)]),
      LateralityFormat[value.laterality].suffix(t),
    ]);
  },
};
