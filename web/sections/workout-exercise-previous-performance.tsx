import * as bg from "@bgord/ui";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";

export function WorkoutExercisePreviousPerformance(props: WorkoutExercise) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const previous = props.previousPerformance;

  if (!previous) return null;

  const scheduledFor = DateFormat.shortDay(language, Temporal.PlainDate.from(previous.scheduledFor));

  return (
    <ui.Meta
      data-cross="center"
      data-stack="x"
      title={t("workout.previous_performance.title")}
      {...ui.Gap.cluster}
    >
      {previous.diff ? (
        <ui.TargetDiffPills diff={previous.diff} />
      ) : (
        <>
          <ui.SetDots sets={previous.sets} target={previous.sets.length} />
          <span data-color="neutral-400" data-fw="medium">
            <ui.ExercisePerformanceSummary sets={previous.sets} />
          </span>
        </>
      )}

      <span data-color="neutral-600">{scheduledFor}</span>
    </ui.Meta>
  );
}
