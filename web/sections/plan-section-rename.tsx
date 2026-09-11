import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-section-create-form";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { ButtonCancel } from "../components";
import { planRoute } from "../router";

export function PlanSectionRename(props: { plan: Plan; section: PlanSectionWithExercises }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const rename = bg.useToggle({ name: `plan-section-rename-${props.section.id}` });

  const planSectionName = bg.useTextField({
    ...Form.planSectionName.field,
    defaultValue: props.section.name,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}/rename`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
        body: JSON.stringify({ planSectionName: planSectionName.value }),
      }),
    onSuccess: async () => {
      rename.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (rename.off) {
    return (
      <button
        className="c-card-title"
        data-cursor="pointer"
        data-hover-color="brand-300"
        data-transform="truncate"
        onClick={rename.enable}
        title={t("plan.section.rename.cta")}
        type="button"
        {...rename.props.controller}
      >
        {props.section.name}
      </button>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...rename.props.target}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          aria-label={t("plan.section.rename.label")}
          className="c-input"
          data-md-width="100%"
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <div data-cross="center" data-gap="1" data-md-width="100%" data-stack="x">
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
            onClick={bg.exec([planSectionName.clear, mutation.reset, rename.disable])}
          />
        </div>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.rename.error")}
        </output>
      )}
    </form>
  );
}
