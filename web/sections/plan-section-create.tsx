import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan } from "../../modules/plans/value-objects/plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionCreate(props: Plan & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const planSectionCreate = bg.useToggle({ name: "plan-section-create" });

  const planSectionName = bg.useTextField(Form.planSectionName.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.id}/section`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
        body: JSON.stringify({ planSectionName: planSectionName.value }),
      }),
    onSuccess: async (_, context) => {
      planSectionCreate.disable();
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
      planSectionName.clear();
      context.form?.reset();
    },
  });

  if (planSectionCreate.off) {
    return (
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <ui.AddButton
          disabled={!props.action.enabled}
          onClick={planSectionCreate.enable}
          {...planSectionCreate.props.controller}
        >
          <ui.AddPlaceholder />

          {t("plan.section.create.cta")}
        </ui.AddButton>

        <ui.ActionHint {...props.action} data-shrink="0" />
      </div>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...planSectionCreate.props.target}
    >
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <ui.AddPlaceholder />

        <input
          aria-label={t("plan.section.create.cta")}
          className="c-input"
          data-grow="1"
          data-minw="0"
          data-variant="transparent"
          placeholder={t("plan.section.create.placeholder")}
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <div data-cross="center" data-shrink="0" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
          <ui.IconButton
            aria-label={t("app.save")}
            disabled={planSectionName.empty || mutation.isLoading}
            title={t("app.save")}
            tone="positive"
            type="submit"
          >
            <Check data-size="sm" />
          </ui.IconButton>

          <ui.IconButton
            aria-label={t("app.cancel")}
            onClick={bg.exec([planSectionName.clear, mutation.reset, planSectionCreate.disable])}
            title={t("app.cancel")}
          >
            <X data-size="sm" />
          </ui.IconButton>
        </div>
      </div>

      {mutation.isError && <ui.Output>{t("plan.section.create.error")}</ui.Output>}
    </form>
  );
}
