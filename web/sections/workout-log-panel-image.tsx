import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";

export function WorkoutLogPanelImage(props: { exercise: WorkoutExercise }) {
  const { exercise } = props;

  if (!exercise.actions.catalogView.available) {
    return <ui.ExerciseImagePlaceholder size={ui.ExerciseImageSize.xs} />;
  }

  return (
    <ui.ExerciseImage
      id={exercise.exerciseId}
      imageEtag={exercise.exerciseImageEtag}
      name={exercise.exerciseName}
      size={ui.ExerciseImageSize.xs}
    />
  );
}
