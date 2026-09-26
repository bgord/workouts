import * as bg from "@bgord/ui";
import { PanelBottomClose } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { useLogPanel } from "../hooks/use-log-panel";
import { useOptimisticSet } from "../hooks/use-optimistic-set";
import { WorkoutLogPanelStep } from "./workout-log-panel-step";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutLogPanel() {
  const { active } = useLogPanel();

  if (!active) return null;

  return (
    <WorkoutLogPanelDialog>
      <WorkoutLogPanelContent exercise={active} key={active.id} />
    </WorkoutLogPanelDialog>
  );
}

function WorkoutLogPanelDialog(props: { children: React.ReactNode }) {
  const t = bg.useTranslations();
  const { close } = useLogPanel();
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    ref.current?.showModal();
    ref.current?.focus();
  }, []);

  bg.useScrollLock();
  bg.useClickOutside(ref, close);

  return (
    <dialog
      aria-label={t("workout.log_panel.label")}
      data-backdrop="medium"
      data-bc="alpha-medium"
      data-bg="neutral-900"
      data-bottom="4"
      data-br="lg"
      data-bs="solid"
      data-bw="hairline"
      data-log-panel
      data-mb="0"
      data-md-bottom="0"
      data-md-br="none"
      data-md-bwb="none"
      data-md-bwx="none"
      data-mx="auto"
      data-overflow="hidden"
      data-pb="4"
      data-shadow="lg"
      data-stack="y"
      data-top="auto"
      onClose={close}
      ref={ref}
      style={{ outline: "none" }}
      tabIndex={-1}
      {...ui.Spacing.surfaceCompact}
    >
      {props.children}
    </dialog>
  );
}

function WorkoutLogPanelContent(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const { close } = useLogPanel();
  const { exercise, pendingSet, setPendingSet } = useOptimisticSet(props.exercise);

  const title = t("workout.exercise.log_panel.close.title", { name: exercise.exerciseName });

  return (
    <>
      {exercise.loggedSets.length > 0 && (
        <div data-minh="0" data-overflow="auto">
          <WorkoutSetList exercise={exercise} flushTop pendingSet={pendingSet} />
        </div>
      )}

      <WorkoutSetLog exercise={exercise} onPending={setPendingSet} />

      <div data-cross="center" data-pt="3" data-stack="x" {...ui.Gap.related}>
        <ui.ExerciseImage
          id={exercise.exerciseId}
          imageEtag={exercise.exerciseImageEtag}
          name={exercise.exerciseName}
          size={ui.ExerciseImageSize.xs}
        />

        <div data-basis="0" data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
          <strong data-color="neutral-100" data-transform="truncate">
            {exercise.exerciseName}
          </strong>

          {exercise.target && <ui.SetDots sets={exercise.loggedSets} target={exercise.target.sets} />}
        </div>

        <div data-shrink="0" data-stack="x">
          <WorkoutLogPanelStep direction="previous" />

          <WorkoutLogPanelStep direction="next" />
        </div>

        <ui.IconButton aria-label={title} onClick={close} title={title}>
          <PanelBottomClose data-size="sm" />
        </ui.IconButton>
      </div>
    </>
  );
}
