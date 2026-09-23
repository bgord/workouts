import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Play } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutStart() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/start`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true }),
  });

  if (!workout.actions.start.available) return null;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.related}
    >
      <button
        className="c-button"
        data-variant="primary"
        disabled={!workout.actions.start.enabled || mutation.isLoading}
        type="submit"
      >
        <Play data-size="sm" />
        {t("workout.start.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("workout.start.error")}</ui.Output>}
    </form>
  );
}
