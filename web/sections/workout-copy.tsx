import * as bg from "@bgord/ui";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WorkoutReport } from "../services/workout-report";

export function WorkoutCopy() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const completedAt = workout.data.completedAt;

  if (!completedAt) return null;

  return (
    <ui.CopyButton
      aria-label={t("workout.copy.cta")}
      done={t("workout.copy.done")}
      text={() => WorkoutReport.create({ ...workout.data, completedAt })}
      title={t("workout.copy.title")}
    />
  );
}
