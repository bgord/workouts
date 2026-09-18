import * as bg from "@bgord/ui";
import { Check, Copy } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { WorkoutReport } from "../services/workout-report";

export function WorkoutCopy() {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  const workoutCopy = bg.useToggle({ name: `workout-copy-${workout.data.id}` });

  const completedAt = workout.data.completedAt;

  if (!completedAt) return null;

  return (
    <ui.IconButton
      aria-label={t("workout.copy.cta")}
      onClick={() =>
        bg.Clipboard.copy({
          text: WorkoutReport.create({ ...workout.data, completedAt }),
          onSuccess: () => {
            workoutCopy.enable();
            setTimeout(workoutCopy.disable, 2000);
          },
        })
      }
      title={workoutCopy.on ? t("workout.copy.done") : t("workout.copy.title")}
      tone={workoutCopy.on ? "brand" : "neutral"}
    >
      {workoutCopy.on ? <Check data-size="sm" /> : <Copy data-size="sm" />}
    </ui.IconButton>
  );
}
