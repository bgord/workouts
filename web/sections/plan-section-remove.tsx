import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionRemove(props: PlanSection) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planSectionRemove = bg.useToggle({ name: `plan-section-remove-${props.id}` });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section/${props.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
      }),
    onSuccess: async () => {
      planSectionRemove.disable();
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.sectionRemove.available) return null;

  return (
    <>
      <ui.IconButton
        aria-label={t("plan.section.remove.title", { name: props.name })}
        disabled={!plan.actions.sectionRemove.enabled}
        onClick={planSectionRemove.enable}
        title={t("plan.section.remove.title", { name: props.name })}
        tone="danger"
        {...planSectionRemove.props.controller}
      >
        <X data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...planSectionRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={planSectionRemove.disable}>
          {t("plan.section.remove.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("plan.section.remove.info", { name: props.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

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
