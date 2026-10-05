import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-section-cooldown-form";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionCooldown(props: PlanSection) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planSectionCooldownUpdate = bg.useToggle({ name: `plan-section-cooldown-update-${props.id}` });

  const cooldown = bg.useTextField({ ...Form.cooldown.field, defaultValue: props.cooldown ?? "" });

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section/${props.id}/cooldown`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ cooldown: cooldown.value?.trim() || null }),
      }),
    onSuccess: async () => {
      planSectionCooldownUpdate.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.sectionCooldownSet.available) {
    if (!props.cooldown) return null;

    return (
      <div data-stack="y" {...ui.Gap.field} data-mt="3">
        <h3>{t("plan.section.cooldown.label")}</h3>

        <p className="c-prose">{props.cooldown}</p>
      </div>
    );
  }

  return (
    <div data-mt="3" data-stack="y" {...ui.Gap.cluster}>
      {planSectionCooldownUpdate.off && !props.cooldown && (
        <>
          <button
            className="c-prose"
            data-color="neutral-500"
            data-cursor="pointer"
            data-self="start"
            data-ta="start"
            disabled={!plan.actions.sectionCooldownSet.enabled}
            onClick={planSectionCooldownUpdate.enable}
            title={t("plan.section.cooldown.label")}
            type="button"
            {...ui.describedByHint(plan.actions.sectionCooldownSet, `plan-section-cooldown-hint-${props.id}`)}
            {...planSectionCooldownUpdate.props.controller}
          >
            {t("plan.section.cooldown.placeholder")}
          </button>

          <ui.ActionHint {...plan.actions.sectionCooldownSet} id={`plan-section-cooldown-hint-${props.id}`} />
        </>
      )}

      {planSectionCooldownUpdate.off && props.cooldown && (
        <button
          data-bc="positive-400"
          data-bwl="thin"
          data-cursor="pointer"
          data-stack="y"
          data-ta="start"
          disabled={!plan.actions.sectionCooldownSet.enabled}
          onClick={planSectionCooldownUpdate.enable}
          title={t("plan.section.cooldown.label")}
          type="button"
          {...ui.Gap.field}
          {...planSectionCooldownUpdate.props.controller}
        >
          <h3>{t("plan.section.cooldown.label")}</h3>

          <span className="c-prose">{props.cooldown}</span>
        </button>
      )}

      {planSectionCooldownUpdate.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.field}
          {...planSectionCooldownUpdate.props.target}
        >
          <h3>{t("plan.section.cooldown.label")}</h3>

          <textarea
            aria-label={t("plan.section.cooldown.label")}
            className="c-textarea"
            data-width="100%"
            placeholder={t("plan.section.cooldown.placeholder")}
            style={{ fieldSizing: "content" }}
            {...bg.Form.textarea(Form.cooldown.pattern)}
            {...cooldown.input.props}
            {...metaEnterSubmit}
          />

          <div data-main="end" data-stack="x" {...ui.Gap.inline}>
            <ui.IconButton
              aria-label={t("app.save")}
              disabled={cooldown.unchanged || mutation.isLoading}
              title={t("app.save")}
              tone="positive"
              type="submit"
            >
              <Check data-size="sm" />
            </ui.IconButton>

            <ui.IconButton
              aria-label={t("app.cancel")}
              onClick={bg.exec([cooldown.clear, mutation.reset, planSectionCooldownUpdate.disable])}
              title={t("app.cancel")}
            >
              <X data-size="sm" />
            </ui.IconButton>
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("plan.section.cooldown.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
