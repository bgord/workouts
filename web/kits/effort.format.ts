import type * as bg from "@bgord/ui";

type Translate = ReturnType<typeof bg.useTranslations>;

export const EffortFormat = {
  set: (reps: number) => String(reps),
  target: (t: Translate, sets: number, reps: number) => t("exercise.sets_reps", { sets, reps }),
  performance: (reps: ReadonlyArray<number>) => reps.join("·"),
};
