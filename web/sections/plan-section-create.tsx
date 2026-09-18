import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Plus, X } from "lucide-react";
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
      bg.Fields.clearAll([planSectionName]);
      context.form?.reset();
    },
  });

  if (planSectionCreate.off) {
    return (
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-grow="1"
          data-hover-color="neutral-0"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={planSectionCreate.enable}
          type="button"
          {...ui.Gap.related}
          {...planSectionCreate.props.controller}
        >
          <div
            data-bc="neutral-700"
            data-br="sm"
            data-bs="dashed"
            data-bw="hairline"
            data-color="neutral-500"
            data-cross="center"
            data-main="center"
            data-shrink="0"
            data-stack="x"
            {...bg.Rhythm().times(3).style.square}
          >
            <Plus data-size="sm" />
          </div>

          {t("plan.section.create.cta")}
        </button>

        <ui.ActionHint {...props.action} data-shrink="0" />
      </div>
    );
  }

  return (
    <form
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...planSectionCreate.props.target}
    >
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.related}>
        <div
          data-bc="neutral-700"
          data-br="sm"
          data-bs="dashed"
          data-bw="hairline"
          data-color="neutral-500"
          data-cross="center"
          data-main="center"
          data-shrink="0"
          data-stack="x"
          {...bg.Rhythm().times(3).style.square}
        >
          <Plus data-size="sm" />
        </div>

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
