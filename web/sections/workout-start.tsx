import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { ActionHint } from "../components";
import { workoutRoute } from "../router";

export function WorkoutStart(props: Workout & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.id}/start`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  return (
    <form data-cross="center" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={!props.action.enabled || mutation.isLoading}
        type="submit"
      >
        <Play data-size="sm" />
        {t("workout.start.cta")}
      </button>

      <ActionHint action={props.action} />

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.start.error")}
        </output>
      )}
    </form>
  );
}
