import * as bg from "@bgord/ui";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { CircleAlert, Trash2 } from "lucide-react";
import { Form } from "../../app/services/workout-history-filters-form";
import type { WorkoutSummary } from "../../modules/workouts/value-objects/workout-summary";
import { ButtonCancel, ButtonClose } from "../components";
import { dashboardRoute } from "../router";

export function WorkoutDiscard(props: WorkoutSummary) {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = useNavigate();
  const dialog = bg.useToggle({ name: "workout-discard" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/workouts/${props.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
      }),
    onSuccess: async () => {
      dialog.disable();
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
        onClick={dialog.enable}
        title={t("workout.discard.title", {
          name: t("workout.title", { plan: props.planName, section: props.planSectionName }),
        })}
        type="button"
        {...dialog.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...dialog}>
        <div data-cross="center" data-main="between" data-stack="x">
          <strong data-color="neutral-100">{t("workout.discard.header")}</strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <div
          data-color="danger-400"
          data-cross="center"
          data-fs="sm"
          data-gap="3"
          data-lh="loose"
          data-stack="x"
        >
          <CircleAlert data-size="md" />
          {t("workout.discard.info", {
            name: t("workout.title", { plan: props.planName, section: props.planSectionName }),
          })}
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && (
            <output
              aria-live="assertive"
              data-color="danger-400"
              data-cross="center"
              data-fs="sm"
              data-gap="3"
              data-stack="x"
            >
              <CircleAlert data-size="md" />
              {t("workout.discard.error")}
            </output>
          )}

          <div data-gap="5" data-main="end" data-stack="x">
            <ButtonCancel onClick={dialog.disable} />

            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("workout.discard.cta")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
