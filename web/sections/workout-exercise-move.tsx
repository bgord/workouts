import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WorkoutExercise } from "../../modules/workouts/queries/get-workout";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutExerciseMove(props: {
  exercise: WorkoutExercise;
  position: number;
  active: boolean;
  children: React.ReactNode;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();

  const move = (position: number) =>
    fetch(`/api/workouts/${workout.data.id}/exercise/${props.exercise.id}/position`, {
      method: "PATCH",
      credentials: "include",
      headers: bg.WeakETag.fromRevision(workout.data.revision),
      body: JSON.stringify({ position }),
    });

  const up = bg.useMutation({
    perform: () => move(props.position - 1),
    onSuccess: () => router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true }),
  });
  const down = bg.useMutation({
    perform: () => move(props.position + 1),
    onSuccess: () => router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true }),
  });

  if (!(props.active && props.exercise.actions.moveUp.available)) return props.children;

  const busy = up.isLoading || down.isLoading;
  const moveUp = props.exercise.actions.moveUp;
  const moveDown = props.exercise.actions.moveDown;

  return (
    <div data-cross="center" data-shrink="0" data-stack="y">
      <ui.IconButton
        aria-label={t("workout.exercise.move.up.title", { name: props.exercise.exerciseName })}
        data-width="auto"
        disabled={!moveUp.enabled || busy}
        onClick={() => up.mutate()}
        title={
          moveUp.hints[0]
            ? t(moveUp.hints[0])
            : t("workout.exercise.move.up.title", { name: props.exercise.exerciseName })
        }
        {...bg.Rhythm().times(2).style.height}
      >
        <ChevronUp data-size="sm" />
      </ui.IconButton>

      {props.children}

      <ui.IconButton
        aria-label={t("workout.exercise.move.down.title", { name: props.exercise.exerciseName })}
        data-width="auto"
        disabled={!moveDown.enabled || busy}
        onClick={() => down.mutate()}
        title={
          moveDown.hints[0]
            ? t(moveDown.hints[0])
            : t("workout.exercise.move.down.title", { name: props.exercise.exerciseName })
        }
        {...bg.Rhythm().times(2).style.height}
      >
        <ChevronDown data-size="sm" />
      </ui.IconButton>

      {(up.isError || down.isError) && (
        <output aria-live="assertive" data-tone="danger">
          {t("workout.exercise.move.error")}
        </output>
      )}
    </div>
  );
}
