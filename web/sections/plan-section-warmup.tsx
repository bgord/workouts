import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-section-warmup-form";
import type { PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanSectionWarmup(props: PlanSection) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planSectionWarmupUpdate = bg.useToggle({ name: `plan-section-warmup-update-${props.id}` });

  const warmup = bg.useTextField({ ...Form.warmup.field, defaultValue: props.warmup ?? "" });

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/section/${props.id}/warmup`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ warmup: warmup.value?.trim() || null }),
      }),
    onSuccess: async () => {
      planSectionWarmupUpdate.disable();
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.sectionWarmupSet.available) {
    if (!props.warmup) return null;

    return (
      <div data-stack="y" {...ui.Gap.field} data-mb="3">
        <ui.Eyebrow>{t("plan.section.warmup.label")}</ui.Eyebrow>

        <p className="c-prose" data-ws="pre-line">
          {props.warmup}
        </p>
      </div>
    );
  }

  return (
    <div data-mb="3" data-stack="y" {...ui.Gap.cluster}>
      {planSectionWarmupUpdate.off && !props.warmup && (
        <>
          <button
            className="c-prose"
            data-color="neutral-500"
            data-cursor="pointer"
            data-self="start"
            data-ta="start"
            disabled={!plan.actions.sectionWarmupSet.enabled}
            onClick={planSectionWarmupUpdate.enable}
            title={t("plan.section.warmup.label")}
            type="button"
            {...planSectionWarmupUpdate.props.controller}
          >
            {t("plan.section.warmup.placeholder")}
          </button>

          <ui.ActionHint {...plan.actions.sectionWarmupSet} />
        </>
      )}

      {planSectionWarmupUpdate.off && props.warmup && (
        <button
          data-bc="warning-500"
          data-bwl="thin"
          data-cursor="pointer"
          data-stack="y"
          data-ta="start"
          disabled={!plan.actions.sectionWarmupSet.enabled}
          onClick={planSectionWarmupUpdate.enable}
          title={t("plan.section.warmup.label")}
          type="button"
          {...ui.Gap.field}
          {...planSectionWarmupUpdate.props.controller}
        >
          <ui.Eyebrow>{t("plan.section.warmup.label")}</ui.Eyebrow>

          <span className="c-prose" data-ws="pre-line">
            {props.warmup}
          </span>
        </button>
      )}

      {planSectionWarmupUpdate.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.field}
          {...planSectionWarmupUpdate.props.target}
        >
          <ui.Eyebrow>{t("plan.section.warmup.label")}</ui.Eyebrow>

          <textarea
            aria-label={t("plan.section.warmup.label")}
            className="c-textarea"
            data-variant="transparent"
            data-width="100%"
            placeholder={t("plan.section.warmup.placeholder")}
            rows={3}
            {...bg.Form.textarea(Form.warmup.pattern)}
            {...warmup.input.props}
            {...metaEnterSubmit}
          />

          <div data-cross="center" data-stack="x" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={warmup.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel
              onClick={bg.exec([warmup.clear, mutation.reset, planSectionWarmupUpdate.disable])}
            />
          </div>

          {mutation.isError && <ui.Output>{t("plan.section.warmup.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
