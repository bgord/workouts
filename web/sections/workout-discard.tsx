import * as bg from "@bgord/ui";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Form } from "../../app/services/workout-history-filters-form";
import * as ui from "../components";
import { dashboardRoute, workoutRoute } from "../router";

export function WorkoutDiscard() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = useNavigate();
  const { workout } = workoutRoute.useLoaderData();

  const workoutDiscard = bg.useToggle({ name: "workout-discard" });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
      }),
    onSuccess: async () => {
      workoutDiscard.disable();
      await navigate({ search: Form.default, to: "/workouts" });
      await router.invalidate({ filter: (match) => match.routeId === dashboardRoute.id, sync: true });
    },
  });

  if (!workout.actions.discard.available) return null;

  const name = t("workout.title", { plan: workout.data.planName, section: workout.data.planSectionName });

  return (
    <>
      <ui.IconButton
        aria-label={t("workout.discard.cta")}
        disabled={!workout.actions.discard.enabled}
        onClick={workoutDiscard.enable}
        title={t("workout.discard.title", { name })}
        tone="danger"
        {...workoutDiscard.props.controller}
      >
        <Trash2 data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...workoutDiscard}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={workoutDiscard.disable}>
          {t("workout.discard.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("workout.discard.info", { name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("workout.discard.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={workoutDiscard.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.discard.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
