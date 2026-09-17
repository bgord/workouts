import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-description-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan } from "../../modules/plans/value-objects/plan";
import * as ui from "../components";
import { planRoute } from "../router";

export function PlanDescription(props: Plan & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const planDescriptionUpdate = bg.useToggle({ name: `plan-description-update-${props.id}` });

  const description = bg.useTextField({
    ...Form.description.field,
    defaultValue: props.description ?? "",
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.id}/description`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.revision) },
        body: JSON.stringify({ description: description.value?.trim() || null }),
      }),
    onSuccess: async () => {
      planDescriptionUpdate.disable();
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (!props.action.available) {
    if (!props.description) return null;

    return (
      <div className="c-prose" data-color="neutral-200" data-fs="sm">
        {props.description}
      </div>
    );
  }

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      {planDescriptionUpdate.off && (
        <button
          className="c-prose"
          data-color={props.description ? "neutral-200" : "neutral-500"}
          data-cursor="pointer"
          data-fs="sm"
          data-self="start"
          data-ta="start"
          disabled={!props.action.enabled}
          onClick={planDescriptionUpdate.enable}
          title={t("plan.description.label")}
          type="button"
          {...planDescriptionUpdate.props.controller}
        >
          {props.description ?? t("plan.description.placeholder")}
        </button>
      )}

      {planDescriptionUpdate.off && <ui.ActionHint {...props.action} />}

      {planDescriptionUpdate.on && (
        <form
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

            {mutation.isError && <ui.Output>{t("plan.description.error")}</ui.Output>}
          </div>
        </form>
      )}
    </div>
  );
}
