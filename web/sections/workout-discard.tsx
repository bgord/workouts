import * as bg from "@bgord/ui";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Form } from "../../app/services/workout-history-filters-form";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo, DialogStatus } from "../components";
import { dashboardRoute } from "../router";

export function WorkoutDiscard(props: WorkoutSummary) {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = useNavigate();

  const workoutDiscard = bg.useToggle({ name: "workout-discard" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/workouts/${props.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
      }),
    onSuccess: async () => {
      workoutDiscard.disable();
      await navigate({ search: Form.default, to: "/workouts" });
      await router.invalidate({ filter: (route) => route.id === dashboardRoute.id, sync: true });
    },
  });

  return (
    <>
      <button
        aria-label={t("workout.discard.cta")}
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-variant="ghost"
        onClick={workoutDiscard.enable}
        title={t("workout.discard.title", {
          name: t("workout.title", { plan: props.planName, section: props.planSectionName }),
        })}
        type="button"
        {...workoutDiscard.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <Dialog {...workoutDiscard}>
        <DialogHeader disabled={mutation.isLoading} onClose={workoutDiscard.disable}>
          {t("workout.discard.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>
            {t("workout.discard.info", {
              name: t("workout.title", { plan: props.planName, section: props.planSectionName }),
            })}
          </DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("workout.discard.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={workoutDiscard.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.discard.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
