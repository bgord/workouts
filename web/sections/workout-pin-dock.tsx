import * as bg from "@bgord/ui";
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

  return <WorkoutPinDockPanel exercise={pinned} key={pinned.id} />;
}

function WorkoutPinDockPanel(props: { exercise: WorkoutExercise }) {
  const t = bg.useTranslations();
  const { unpin } = usePinnedExercise();
  const { exercise, pendingSet, setPendingSet } = useOptimisticSet(props.exercise);

  return (
    <>
      <div
        aria-hidden
        data-inset="0"
        data-pointer-events="none"
        data-position="fixed"
        data-z="1"
        style={{ background: "var(--backdrop-medium)" }}
      />

      <aside
        aria-label={t("workout.pin.dock.label")}
        data-bc="alpha-medium"
        data-bg="neutral-900"
        data-bottom="4"
        data-br="lg"
        data-bs="solid"
        data-bw="hairline"
        data-md-br="none"
        data-md-bwb="none"
        data-md-bwx="none"
        data-pb="4"
        data-pin-dock
        data-position="sticky"
        data-shadow="lg"
        data-stack="y"
        data-z="2"
        {...ui.Spacing.surfaceCompact}
      >
        {exercise.loggedSets.length > 0 && (
          <div data-overflow="auto" {...bg.Rhythm().times(18).style.maxHeight}>
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
      </aside>
    </>
  );
}
