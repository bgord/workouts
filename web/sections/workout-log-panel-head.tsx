import * as bg from "@bgord/ui";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { useLogPanel } from "../hooks/use-log-panel";
import { PanelBottomClose, Target } from "../icons";
import { WorkoutLogPanelImage } from "./workout-log-panel-image";

export function WorkoutLogPanelHead(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const { available, close, position } = useLogPanel();
  const { exercise } = props;

  const title = t("workout.exercise.log_panel.close.title", { name: exercise.exerciseName });

  const description = bg.useToggle({ name: `workout-log-panel-description-${exercise.id}` });

  return (
    <>
      <fieldset
        aria-label={exercise.exerciseName}
        data-bcb="alpha-subtle"
        data-bsb="solid"
        data-bwb="hairline"
        data-cross="center"
        data-mb="2"
        data-minw="0"
        data-pb="3"
        data-stack="x"
        {...ui.Gap.related}
      >
        <button
          aria-label={t("workout.exercise.description.toggle")}
          data-br="md"
          data-cursor="pointer"
          data-hover-opacity="medium"
          data-stack="x"
          onClick={description.toggle}
          title={t("workout.exercise.description.toggle")}
          type="button"
          {...description.props.controller}
        >
          <WorkoutLogPanelImage exercise={exercise} />
        </button>

        <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          {exercise.actions.catalogView.available && (
            <ui.ExerciseLink
              data-transform="line-clamp"
              params={{ exerciseId: exercise.exerciseId }}
              title={exercise.exerciseName}
              to="/catalog/exercise/$exerciseId"
            >
              {exercise.exerciseName}
            </ui.ExerciseLink>
          )}

          {!exercise.actions.catalogView.available && (
            <strong data-color="neutral-100" data-transform="line-clamp" title={exercise.exerciseName}>
              {exercise.exerciseName}
            </strong>
          )}

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
                    laterality={exercise.laterality}
                    load={exercise.target.load}
                    reps={exercise.target.reps}
                    resistance={exercise.resistance}
                    scheme={RepsScheme.of(exercise.prescription.reps)}
                    sets={exercise.target.sets}
                  />
                </span>
              </>
            )}

            {exercise.prescription.rir !== undefined && (
              <ui.RirBadge rir={exercise.prescription.rir} title={t("rir.target.label")} />
            )}

            {exercise.target && <ui.SetDots sets={exercise.loggedSets} target={exercise.target.sets} />}
          </div>
        </div>

        <ui.IconButton aria-label={title} onClick={close} title={title}>
          <PanelBottomClose data-size="sm" />
        </ui.IconButton>
      </fieldset>

      {description.on && (
        <div className="c-prose" data-color="neutral-300" data-mb="2" {...description.props.target}>
          {exercise.exerciseDescription}
        </div>
      )}
    </>
  );
}
