import * as bg from "@bgord/ui";
import { Pencil, Target } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";

export function WorkoutExerciseTarget(props: { exercise: WorkoutExercise } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { toggle } = bg.extractUseToggle(props);
  const { target, actions } = props.exercise;

  if (!actions.targetSet.available) {
    if (!target) return null;

    return (
      <div
        data-color="neutral-300"
        data-cross="center"
        data-fs="sm"
        data-fw="medium"
        data-shrink="0"
        data-stack="x"
        data-transform="font-variant-numeric"
        data-wrap="nowrap"
        {...ui.Gap.inline}
      >
        <Target data-color="neutral-500" data-size="xs" />
        <ui.SetsRepsLoad load={target.load} reps={target.reps} sets={target.sets} />
      </div>
    );
  }

  return (
    <button
      data-bc={target ? undefined : "neutral-700"}
      data-br="sm"
      data-bs={target ? undefined : "dashed"}
      data-bw={target ? undefined : "hairline"}
      data-color={target ? "neutral-300" : "neutral-400"}
      data-cross="center"
      data-cursor="pointer"
      data-fs="xs"
      data-fw={target ? "medium" : undefined}
      data-hover-color="neutral-0"
      data-px={target ? undefined : "2"}
      data-shrink="0"
      data-stack="x"
      data-transform="font-variant-numeric"
      data-wrap="nowrap"
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
          <ui.SetsRepsLoad load={target.load} reps={target.reps} sets={target.sets} />
        </>
      )}

      {!target && t("workout.target.cta")}
    </button>
  );
}
