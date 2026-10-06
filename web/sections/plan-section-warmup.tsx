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
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.sectionWarmupSet.available) {
    if (!props.warmup) return null;

    return (
      <div data-stack="y" {...ui.Gap.field} data-mb="3">
        <h3>{t("plan.section.warmup.label")}</h3>

        <p className="c-prose">{props.warmup}</p>
      </div>
    );
  }

  return (
    <div data-mb="3" data-stack="y" {...ui.Gap.cluster}>
      {planSectionWarmupUpdate.off && !props.warmup && (
        <>
          <ui.TextareaTrigger
            data-color="neutral-500"
            disabled={!plan.actions.sectionWarmupSet.enabled}
            onClick={planSectionWarmupUpdate.enable}
            title={t("plan.section.warmup.label")}
            {...ui.describedByHint(plan.actions.sectionWarmupSet, `plan-section-warmup-hint-${props.id}`)}
            {...planSectionWarmupUpdate.props.controller}
          >
            {t("plan.section.warmup.placeholder")}
          </ui.TextareaTrigger>

          <ui.ActionHint {...plan.actions.sectionWarmupSet} id={`plan-section-warmup-hint-${props.id}`} />
        </>
      )}

      {planSectionWarmupUpdate.off && props.warmup && (
        <button
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
          <h3>{t("plan.section.warmup.label")}</h3>

          <span className="c-prose">{props.warmup}</span>
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
          {props.warmup && <h3>{t("plan.section.warmup.label")}</h3>}

          <div data-cross="start" data-md-cross="stretch" data-md-stack="y" data-stack="x" {...ui.Gap.inline}>
            <textarea
              aria-label={t("plan.section.warmup.label")}
              autoFocus
              className="c-textarea"
              data-grow="1"
              data-minw="0"
              placeholder={t("plan.section.warmup.placeholder")}
              style={{ fieldSizing: "content" }}
              {...bg.Form.textarea(Form.warmup.pattern)}
              {...warmup.input.props}
              {...metaEnterSubmit}
            />

            <ui.InlineEditActions
              data-md-self="end"
              disabled={warmup.unchanged || mutation.isLoading}
              onCancel={bg.exec([warmup.clear, mutation.reset, planSectionWarmupUpdate.disable])}
            />
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("plan.section.warmup.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
