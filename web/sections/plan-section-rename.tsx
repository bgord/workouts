import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionRename(
  props: { plan: Plan; section: PlanSectionWithExercises } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

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
      toggle.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (toggle.off) {
    return (
      <button
        className="c-card-title"
        data-cursor="pointer"
        data-hover-color="brand-300"
        data-transform="truncate"
        onClick={toggle.enable}
        title={t("plan.section.rename.cta")}
        type="button"
        {...toggle.props.controller}
      >
        {props.section.name}
      </button>
    );
  }

  return (
    <form data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Spacing.cluster} {...toggle.props.target}>
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Spacing.inline}>
        <input
          aria-label={t("plan.section.rename.label")}
          className="c-input"
          data-grow="1"
          data-variant="transparent"
          {...bg.Rhythm().times(0).style.minWidth}
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
