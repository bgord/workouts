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
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (!plan.actions.descriptionSet.available) {
    if (!plan.data.description) return null;

    return (
      <p className="c-prose" data-color="neutral-200" data-fs="sm">
        {plan.data.description}
      </p>
    );
  }

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      {planDescriptionUpdate.off && (
        <>
          <button
            className="c-prose"
            data-color={plan.data.description ? "neutral-200" : "neutral-500"}
            data-cursor="pointer"
            data-fs="sm"
            data-self="start"
            data-ta="start"
            disabled={!plan.actions.descriptionSet.enabled}
            onClick={planDescriptionUpdate.enable}
            title={t("plan.description.label")}
            type="button"
            {...planDescriptionUpdate.props.controller}
          >
            {plan.data.description ?? t("plan.description.placeholder")}
          </button>

          <ui.ActionHint {...plan.actions.descriptionSet} />
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
          <textarea
            aria-label={t("plan.description.label")}
            className="c-textarea"
            data-variant="transparent"
            data-width="100%"
            placeholder={t("plan.description.placeholder")}
            rows={3}
            {...bg.Form.textarea(Form.description.pattern)}
            {...description.input.props}
            {...metaEnterSubmit}
          />

          <div data-cross="center" data-stack="x" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={description.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel
              onClick={bg.exec([description.clear, mutation.reset, planDescriptionUpdate.disable])}
            />
          </div>

          {mutation.isError && <ui.Output>{t("plan.description.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
