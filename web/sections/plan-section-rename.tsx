import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionRename(props: { section: PlanSection } & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);

  const planSectionName = bg.useTextField({
    ...Form.planSectionName.field,
    defaultValue: props.section.name,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section/${props.section.id}/rename`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ planSectionName: planSectionName.value }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.sectionRename.available) {
    return (
      <h2 data-transform="truncate" title={props.section.name}>
        {props.section.name}
      </h2>
    );
  }

  if (toggle.off) {
    return (
      <h2>
        <button
          data-cursor="pointer"
          data-disp="block"
          data-maxw="100%"
          data-transform="truncate"
          disabled={!plan.actions.sectionRename.enabled}
          onClick={toggle.enable}
          title={t("plan.section.rename.cta")}
          type="button"
          {...toggle.props.controller}
        >
          {props.section.name}
        </button>
      </h2>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("plan.section.rename.label")}
          className="c-input"
          data-grow="1"
          data-minw="0"
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <ui.IconButton
          aria-label={t("app.save")}
          disabled={planSectionName.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>

        <ui.IconButton
          aria-label={t("app.cancel")}
          onClick={bg.exec([planSectionName.clear, mutation.reset, toggle.disable])}
          title={t("app.cancel")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      {mutation.isError && <ui.Output>{t("plan.section.rename.error")}</ui.Output>}
    </form>
  );
}
