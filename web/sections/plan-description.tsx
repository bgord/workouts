import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-description-form";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanDescription() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planDescriptionUpdate = bg.useToggle({ name: `plan-description-update-${plan.data.id}` });

  const description = bg.useTextField({
    ...Form.description.field,
    defaultValue: plan.data.description ?? "",
  });

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/description`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ description: description.value?.trim() || null }),
      }),
    onSuccess: async () => {
      planDescriptionUpdate.disable();
      await router.invalidate({ filter: (match) => match.routeId === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.descriptionSet.available) {
    if (!plan.data.description) return null;

    return (
      <p className="c-prose" data-ml="3">
        {plan.data.description}
      </p>
    );
  }

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      {planDescriptionUpdate.off && (
        <>
          <ui.TextareaTrigger
            data-color={plan.data.description ? undefined : "neutral-500"}
            disabled={!plan.actions.descriptionSet.enabled}
            onClick={planDescriptionUpdate.enable}
            title={t("plan.description.label")}
            {...ui.describedByHint(plan.actions.descriptionSet, "plan-description-hint")}
            {...planDescriptionUpdate.props.controller}
          >
            {plan.data.description ?? t("plan.description.placeholder")}
          </ui.TextareaTrigger>

          <ui.ActionHint {...plan.actions.descriptionSet} id="plan-description-hint" />
        </>
      )}

      {planDescriptionUpdate.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...planDescriptionUpdate.props.target}
        >
          <div data-cross="start" data-md-cross="stretch" data-md-stack="y" data-stack="x" {...ui.Gap.inline}>
            <textarea
              aria-label={t("plan.description.label")}
              autoFocus
              className="c-textarea"
              data-grow="1"
              data-minw="0"
              placeholder={t("plan.description.placeholder")}
              style={{ fieldSizing: "content" }}
              {...bg.Form.textarea(Form.description.pattern)}
              {...description.input.props}
              {...metaEnterSubmit}
            />

            <ui.InlineEditActions
              data-md-self="end"
              disabled={description.unchanged || mutation.isLoading}
              onCancel={bg.exec([description.clear, mutation.reset, planDescriptionUpdate.disable])}
            />
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("plan.description.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
