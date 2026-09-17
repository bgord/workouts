import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Play } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import * as ui from "../components";
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
    <form
      data-cross="center"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.related}
    >
      <button
        className="c-button"
        data-variant="primary"
        disabled={!props.action.enabled || mutation.isLoading}
        type="submit"
      >
        <Play data-size="sm" />
        {t("workout.start.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("workout.start.error")}</ui.Output>}
    </form>
  );
}
