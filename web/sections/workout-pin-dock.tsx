import * as bg from "@bgord/ui";
import { useLayoutEffect, useRef } from "react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { useOptimisticSet } from "../hooks/use-optimistic-set";
import { usePinnedExercise } from "../hooks/use-pinned-exercise";
import { WorkoutPinStep } from "./workout-pin-step";
import { WorkoutSetList } from "./workout-set-list";
import { WorkoutSetLog } from "./workout-set-log";

export function WorkoutPinDock() {
  const { pinned } = usePinnedExercise();

  if (!pinned) return null;

  return (
    <WorkoutPinDockDialog>
      <WorkoutPinDockPanel exercise={pinned} key={pinned.id} />
    </WorkoutPinDockDialog>
  );
}

function WorkoutPinDockDialog(props: { children: React.ReactNode }) {
  const t = bg.useTranslations();
  const { unpin } = usePinnedExercise();
  const ref = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    ref.current?.showModal();
    ref.current?.focus();
  }, []);

  bg.useScrollLock();
  bg.useClickOutside(ref, unpin);

  return (
    <dialog
      aria-label={t("workout.pin.dock.label")}
      data-backdrop="medium"
      data-bc="alpha-medium"
      data-bg="neutral-900"
      data-bottom="4"
      data-br="lg"
      data-bs="solid"
      data-bw="hairline"
      data-mb="0"
      data-md-bottom="0"
      data-md-br="none"
      data-md-bwb="none"
      data-md-bwx="none"
      data-mx="auto"
      data-overflow="hidden"
      data-pb="4"
      data-pin-dock
      data-shadow="lg"
      data-stack="y"
      data-top="auto"
      onClose={unpin}
      ref={ref}
      style={{ outline: "none" }}
      tabIndex={-1}
      {...ui.Spacing.surfaceCompact}
    >
      {props.children}
    </dialog>
  );
}

function WorkoutPinDockPanel(props: { exercise: WorkoutExercise }) {
  const { unpin } = usePinnedExercise();
  const { exercise, pendingSet, setPendingSet } = useOptimisticSet(props.exercise);

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
          <WorkoutPinStep direction="previous" />

          <WorkoutPinStep direction="next" />
        </div>

        <ui.ButtonClose onClick={unpin} />
      </div>
    </>
  );
}
