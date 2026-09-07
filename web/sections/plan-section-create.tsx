import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-section-create-form";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ButtonCancel } from "../components";
import { planRoute } from "../router";

export function PlanSectionCreate(props: Plan) {
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
      <button
        className="c-button"
        data-variant="secondary"
        onClick={create.enable}
        type="button"
        {...create.props.controller}
      >
        {t("plan.section.create.cta")}
      </button>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...create.props.target}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <label className="c-label" data-variant="inline" {...planSectionName.label.props}>
          {t("plan.section.create.label")}
        </label>

        <input
          className="c-input"
          placeholder={t("plan.section.create.placeholder")}
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
          {t("app.save")}
        </button>

        <ButtonCancel onClick={bg.exec([planSectionName.clear, mutation.reset, create.disable])} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.create.error")}
        </output>
      )}
    </form>
  );
}
