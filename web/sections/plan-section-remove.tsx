import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo } from "../components";
import { planRoute } from "../router";

export function PlanSectionRemove(props: { plan: Plan; section: PlanSectionWithExercises }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const dialog = bg.useToggle({ name: `plan-section-remove-${props.section.id}` });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
      }),
    onSuccess: async () => {
      dialog.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  return (
    <>
      <button
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-ml="auto"
        data-variant="ghost"
        onClick={dialog.enable}
        title={t("plan.section.remove.title", { name: props.section.name })}
        type="button"
        {...dialog.props.controller}
      >
        <X data-size="sm" />
      </button>

      <Dialog {...dialog}>
        <DialogHeader disabled={mutation.isLoading} onClose={dialog.disable}>
          {t("plan.section.remove.header")}
        </DialogHeader>

        <DialogInfo variant="danger">
          {t("plan.section.remove.info", { name: props.section.name })}
        </DialogInfo>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("plan.section.remove.error")}</DialogError>}

          <DialogFooter onCancel={dialog.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("plan.section.remove.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
