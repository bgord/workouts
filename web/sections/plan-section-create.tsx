import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ActionHint, ButtonCancel } from "../components";
import { planRoute } from "../router";

const placeholder = { ...bg.Rhythm().times(3).width, ...bg.Rhythm().times(3).height };

export function PlanSectionCreate(props: Plan & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const create = bg.useToggle({ name: "plan-section-create" });

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
      create.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });

      bg.Fields.clearAll([planSectionName]);
      context.form?.reset();
    },
  });

  if (create.off) {
    return (
      <div data-cross="center" data-gap="3" data-stack="x" data-wrap="nowrap">
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-gap="3"
          data-grow="1"
          data-hover-color="neutral-0"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={create.enable}
          type="button"
          {...create.props.controller}
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
            style={placeholder}
          >
            <Plus data-size="sm" />
          </div>

          {t("plan.section.create.cta")}
        </button>

        <ActionHint action={props.action} data-shrink="0" />
      </div>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...create.props.target}>
      <div data-cross="center" data-gap="3" data-md-wrap="wrap" data-stack="x" data-wrap="nowrap">
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
          style={placeholder}
        >
          <Plus data-size="sm" />
        </div>

        <input
          aria-label={t("plan.section.create.cta")}
          className="c-input"
          data-grow="1"
          data-variant="transparent"
          placeholder={t("plan.section.create.placeholder")}
          {...bg.Rhythm().times(0).style.minWidth}
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <div data-cross="center" data-gap="1" data-md-width="100%" data-stack="x" data-wrap="nowrap">
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="primary"
            disabled={planSectionName.empty || mutation.isLoading}
            type="submit"
          >
            <Plus data-size="sm" />
            {t("plan.section.create.submit.cta")}
          </button>

          <ButtonCancel
            data-md-grow="1"
            onClick={bg.exec([planSectionName.clear, mutation.reset, create.disable])}
          />
        </div>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.create.error")}
        </output>
      )}
    </form>
  );
}
