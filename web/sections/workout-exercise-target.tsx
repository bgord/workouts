import * as bg from "@bgord/ui";
import { Pencil, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { SetNotation } from "../services/set-notation";

export function WorkoutExerciseTarget(props: { exercise: WorkoutExercise } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const { toggle } = bg.extractUseToggle(props);
  const { target, actions } = props.exercise;

  if (!actions.targetSet.available) {
    /* v8 ignore next */
    if (!target) return null;

    return (
      <div
        data-color="neutral-300"
        data-fs="xs"
        data-fw="medium"
        data-shrink="0"
        data-stack="x"
        data-transform="font-variant-numeric"
        {...ui.Gap.inline}
      >
        <Target data-color="neutral-500" data-size="xs" />
        <ui.TargetValue
          load={target.load}
          reps={target.reps}
          resistance={props.exercise.resistance}
          sets={target.sets}
        />
      </div>
    );
  }

  return (
    <button
      aria-label={
        target
          ? t("workout.target.edit", {
              target: SetNotation.target(t, language, { resistance: props.exercise.resistance, ...target }),
            })
          : undefined
      }
      data-bc={target ? undefined : "alpha-strong"}
      data-br="sm"
      data-bs={target ? undefined : "dashed"}
      data-bw={target ? undefined : "hairline"}
      data-color={target ? "neutral-300" : "neutral-400"}
      data-cursor="pointer"
      data-fs="xs"
      data-fw={target ? "medium" : undefined}
      data-hover-color="neutral-0"
      data-px={target ? undefined : "2"}
      data-shrink="0"
      data-stack="x"
      data-transform="font-variant-numeric"
      disabled={!actions.targetSet.enabled}
      onClick={toggle.toggle}
      title={t("workout.target.cta")}
      type="button"
      {...ui.Gap.inline}
      {...toggle.props.controller}
    >
      {target && <Pencil data-color="neutral-500" data-size="xs" />}
      <Target data-color="neutral-500" data-size="xs" />

      {target && (
        <>
          <ui.TargetValue
            load={target.load}
            reps={target.reps}
            resistance={props.exercise.resistance}
            sets={target.sets}
          />
        </>
      )}

      {!target && t("workout.target.cta")}
    </button>
  );
}
