import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionRemove(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  action: ActionState;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const planSectionRemove = bg.useToggle({ name: `plan-section-remove-${props.section.id}` });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
      }),
    onSuccess: async () => {
      planSectionRemove.disable();
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  return (
    <>
      <ui.IconButton
        aria-label={t("plan.section.remove.title", { name: props.section.name })}
        disabled={!props.action.enabled}
        onClick={planSectionRemove.enable}
        title={t("plan.section.remove.title", { name: props.section.name })}
        tone="danger"
        {...planSectionRemove.props.controller}
      >
        <X data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...planSectionRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={planSectionRemove.disable}>
          {t("plan.section.remove.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Gap.related}>
          <ui.DialogInfo>{t("plan.section.remove.info", { name: props.section.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("plan.section.remove.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={planSectionRemove.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("plan.section.remove.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
