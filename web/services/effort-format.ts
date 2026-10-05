import type * as bg from "@bgord/ui";

export const EffortFormat = {
  set: (reps: number) => String(reps),
  target: (t: bg.TranslateType, sets: number, reps: number) => t("exercise.sets_reps", { sets, reps }),
  performance: (reps: ReadonlyArray<number>) => reps.join("·"),
};
