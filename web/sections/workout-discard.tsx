import * as bg from "@bgord/ui";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/workout-history-filters-form";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { homeRoute } from "../router";

export function WorkoutDiscard(props: { workout: WorkoutSummary }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = useNavigate();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/workouts/${props.workout.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.workout.revision),
      }),
    onSuccess: async () => {
      await navigate({ search: Form.default, to: "/" });
      await router.invalidate({ filter: (route) => route.id === homeRoute.id, sync: true });
    },
  });

  return (
    <form data-cross="end" data-gap="1" data-stack="y" onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-color="danger-400"
        data-variant="ghost"
        disabled={mutation.isLoading}
        title={t("workout.discard.title", { name: props.workout.planName })}
        type="submit"
      >
        {t("workout.discard.cta")}
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.discard.error")}
        </output>
      )}
    </form>
  );
}
