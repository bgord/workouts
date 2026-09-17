import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutComplete(props: Workout & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.id}/complete`, {
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
      {...ui.Spacing.related}
    >
      <button
        className="c-button"
        data-variant="primary"
        disabled={!props.action.enabled || mutation.isLoading}
        type="submit"
      >
        <Check data-size="sm" />
        {t("workout.complete.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("workout.complete.error")}</ui.Output>}
    </form>
  );
}
