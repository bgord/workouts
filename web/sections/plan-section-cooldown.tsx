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
          <ui.TextareaTrigger
            data-color="neutral-500"
            disabled={!plan.actions.sectionCooldownSet.enabled}
            onClick={planSectionCooldownUpdate.enable}
            title={t("plan.section.cooldown.label")}
            {...ui.describedByHint(plan.actions.sectionCooldownSet, `plan-section-cooldown-hint-${props.id}`)}
            {...planSectionCooldownUpdate.props.controller}
          >
            {t("plan.section.cooldown.placeholder")}
          </ui.TextareaTrigger>

          <ui.ActionHint {...plan.actions.sectionCooldownSet} id={`plan-section-cooldown-hint-${props.id}`} />
        </>
      )}

      {planSectionCooldownUpdate.off && props.cooldown && (
        <button
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
          {props.cooldown && <h3>{t("plan.section.cooldown.label")}</h3>}

          <div data-cross="start" data-md-cross="stretch" data-md-stack="y" data-stack="x" {...ui.Gap.inline}>
            <textarea
              aria-label={t("plan.section.cooldown.label")}
              autoFocus
              className="c-textarea"
              data-grow="1"
              data-minw="0"
              placeholder={t("plan.section.cooldown.placeholder")}
              style={{ fieldSizing: "content" }}
              {...bg.Form.textarea(Form.cooldown.pattern)}
              {...cooldown.input.props}
              {...metaEnterSubmit}
            />

            <ui.InlineEditActions
              data-md-self="end"
              disabled={cooldown.unchanged || mutation.isLoading}
              onCancel={bg.exec([cooldown.clear, mutation.reset, planSectionCooldownUpdate.disable])}
            />
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
