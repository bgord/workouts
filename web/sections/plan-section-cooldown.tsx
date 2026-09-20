import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
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
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.sectionCooldownSet.available) {
    if (!props.cooldown) return null;

    return (
      <div data-stack="y" {...ui.Gap.field} data-mt="3">
        <ui.Eyebrow>{t("plan.section.cooldown.label")}</ui.Eyebrow>

        <p className="c-prose" data-color="neutral-200" data-fs="sm" data-ws="pre-line">
          {props.cooldown}
        </p>
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
            data-fs="sm"
            data-self="start"
            data-ta="start"
            disabled={!plan.actions.sectionCooldownSet.enabled}
            onClick={planSectionCooldownUpdate.enable}
            title={t("plan.section.cooldown.label")}
            type="button"
            {...planSectionCooldownUpdate.props.controller}
          >
            {t("plan.section.cooldown.placeholder")}
          </button>

          <ui.ActionHint {...plan.actions.sectionCooldownSet} />
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
          <ui.Eyebrow>{t("plan.section.cooldown.label")}</ui.Eyebrow>

          <span className="c-prose" data-color="neutral-200" data-fs="sm" data-ws="pre-line">
            {props.cooldown}
          </span>
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
          <ui.Eyebrow>{t("plan.section.cooldown.label")}</ui.Eyebrow>

          <textarea
            aria-label={t("plan.section.cooldown.label")}
            className="c-textarea"
            data-variant="transparent"
            data-width="100%"
            placeholder={t("plan.section.cooldown.placeholder")}
            rows={3}
            {...bg.Form.textarea(Form.cooldown.pattern)}
            {...cooldown.input.props}
            {...metaEnterSubmit}
          />

          <div data-cross="center" data-stack="x" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={cooldown.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel
              onClick={bg.exec([cooldown.clear, mutation.reset, planSectionCooldownUpdate.disable])}
            />
          </div>

          {mutation.isError && <ui.Output>{t("plan.section.cooldown.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
