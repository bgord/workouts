import * as bg from "@bgord/ui";
import { PanelBottomClose, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { useLogPanel } from "../hooks/use-log-panel";
import { WorkoutLogPanelImage } from "./workout-log-panel-image";

export function WorkoutLogPanelHead(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const { available, close, position } = useLogPanel();
  const { exercise } = props;

  const title = t("workout.exercise.log_panel.close.title", { name: exercise.exerciseName });

  return (
    <div
      aria-label={exercise.exerciseName}
      data-bcb="alpha-subtle"
      data-bsb="solid"
      data-bwb="hairline"
      data-cross="center"
      data-mb="2"
      data-pb="3"
      data-stack="x"
      role="group"
      {...ui.Gap.related}
    >
      <WorkoutLogPanelImage exercise={exercise} />

      <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
        <strong data-color="neutral-100" data-transform="line-clamp" title={exercise.exerciseName}>
          {exercise.exerciseName}
        </strong>

        <div data-color="neutral-400" data-fs="xs" data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          <span data-transform="font-variant-numeric">
            {t("workout.log_panel.position", { position, total: available.length })}
          </span>

          {exercise.target && (
            <>
              <span data-color="neutral-600">·</span>

              <span
                data-color="neutral-300"
                data-fw="medium"
                data-stack="x"
                data-transform="font-variant-numeric"
                {...ui.Gap.inline}
              >
                <Target data-color="neutral-500" data-size="xs" />
                <ui.TargetValue
                  load={exercise.target.load}
                  reps={exercise.target.reps}
                  resistance={exercise.resistance}
                  sets={exercise.target.sets}
                />
              </span>

              <ui.SetDots sets={exercise.loggedSets} target={exercise.target.sets} />
            </>
          )}
        </div>
      </div>

      <ui.IconButton aria-label={title} onClick={close} title={title}>
        <PanelBottomClose data-size="sm" />
      </ui.IconButton>
    </div>
  );
}
