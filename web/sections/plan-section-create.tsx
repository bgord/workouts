import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ActionHint, ButtonCancel } from "../components";
import { planRoute } from "../router";

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
      <div data-cross="center" data-gap="3" data-stack="x">
        <ActionHint action={props.action} />

        <button
          className="c-button"
          data-variant="secondary"
          disabled={!props.action.enabled}
          onClick={create.enable}
          type="button"
          {...create.props.controller}
        >
          <Plus data-size="sm" />
          {t("plan.section.create.cta")}
        </button>
      </div>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...create.props.target}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          className="c-input"
          data-md-width="100%"
          placeholder={t("plan.section.create.placeholder")}
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <div data-cross="center" data-gap="2" data-md-width="100%" data-stack="x">
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="secondary"
            disabled={mutation.isLoading}
            type="submit"
          >
            {t("app.save")}
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
