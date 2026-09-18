import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutComplete() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/complete`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  if (!workout.actions.complete.available) return null;

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={!workout.actions.complete.enabled || mutation.isLoading}
        type="submit"
      >
        <Check data-size="sm" />
        {t("workout.complete.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("workout.complete.error")}</ui.Output>}
    </form>
  );
}
