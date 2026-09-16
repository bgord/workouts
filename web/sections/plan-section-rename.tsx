import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { planRoute } from "../router";

export function PlanSectionRename(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  toggle: bg.UseToggleReturnType;
}) {
  const t = bg.useTranslations();
  const router = useRouter();
  const rename = props.toggle;

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
      <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
        <input
          aria-label={t("plan.section.rename.label")}
          className="c-input"
          data-grow="1"
          data-variant="transparent"
          {...bg.Rhythm().times(0).style.minWidth}
          {...bg.Form.input(Form.planSectionName.pattern)}
          {...planSectionName.input.props}
        />

        <button
          aria-label={t("app.save")}
          className="c-button"
          data-color="positive-400"
          data-hover-color="positive-200"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={planSectionName.unchanged || mutation.isLoading}
          title={t("app.save")}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
        >
          <Check data-size="sm" />
        </button>

        <button
          aria-label={t("app.cancel")}
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          onClick={bg.exec([planSectionName.clear, mutation.reset, rename.disable])}
          title={t("app.cancel")}
          type="button"
          {...bg.Rhythm().times(3).style.width}
        >
          <X data-size="sm" />
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs">
          {t("plan.section.rename.error")}
        </output>
      )}
    </form>
  );
}
