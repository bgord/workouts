import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-section-create-form";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planSectionCreate = bg.useToggle({ name: "plan-section-create" });

  const planSectionName = bg.useTextField(Form.planSectionName.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ planSectionName: planSectionName.value }),
      }),
    onSuccess: async (_, context) => {
      planSectionCreate.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
      planSectionName.clear();
      context.form?.reset();
    },
  });

  if (!plan.actions.sectionCreate.available) return null;

  return (
    <ui.HairlineBlock data-stack="y" first={plan.data.sections.length === 0} last {...ui.Spacing.row}>
      {planSectionCreate.off && (
        <div data-stack="x" {...ui.Gap.related}>
          <ui.AddButton
            disabled={!plan.actions.sectionCreate.enabled}
            onClick={planSectionCreate.enable}
            {...planSectionCreate.props.controller}
          >
            <ui.AddPlaceholder />

            {t("plan.section.create.cta")}
          </ui.AddButton>

          <ui.ActionHint {...plan.actions.sectionCreate} data-shrink="0" />
        </div>
      )}

      {planSectionCreate.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...planSectionCreate.props.target}
        >
          <div data-stack="x" {...ui.Gap.related}>
            <ui.AddPlaceholder />

            <input
              aria-label={t("plan.section.create.cta")}
              className="c-input"
              data-grow="1"
              data-minw="0"
              placeholder={t("plan.section.create.placeholder")}
              {...bg.Form.input(Form.planSectionName.pattern)}
              {...planSectionName.input.props}
            />

            <div data-shrink="0" data-stack="x" {...ui.Gap.inline}>
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

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("plan.section.create.error")}
            </output>
          )}
        </form>
      )}
    </ui.HairlineBlock>
  );
}
