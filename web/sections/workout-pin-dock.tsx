import * as ui from "../components";
import type { UsePinnedExerciseReturnType } from "../hooks/use-pinned-exercise";
import { workoutRoute } from "../router";

export function WorkoutPinDock(props: UsePinnedExerciseReturnType) {
  const { workout } = workoutRoute.useLoaderData();

  const exercise = workout.data.exercises.find(
    (exercise) => exercise.id === props.id && exercise.actions.setLog.available,
  );

  if (!exercise) return null;

  return (
    <aside
      data-bottom="0"
      data-left="0"
      data-maxw="md"
      data-md-px="0"
      data-mx="auto"
      data-pin-dock
      data-position="fixed"
      data-px="3"
      data-right="0"
      data-z="2"
    >
      <div
        data-bc="alpha-medium"
        data-bg="neutral-900"
        data-br="lg"
        data-bs="solid"
        data-bw="hairline"
        data-cross="center"
        data-mb="4"
        data-md-br="none"
        data-md-bwb="none"
        data-md-bwx="none"
        data-md-mb="0"
        data-p="3"
        data-shadow="lg"
        data-stack="x"
        {...ui.Gap.related}
      >
        <strong data-color="neutral-100" data-grow="1" data-minw="0" data-transform="truncate">
          {exercise.exerciseName}
        </strong>

        <ui.ButtonClose onClick={props.unpin} />
      </div>
    </aside>
  );
}
