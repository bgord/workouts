import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-description-form";
import type { ActionState } from "../../modules/action-state";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ActionHint, ButtonCancel } from "../components";
import { planRoute } from "../router";

export function PlanDescription(props: Plan & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const update = bg.useToggle({ name: `plan-description-update-${props.id}` });

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
      update.disable();
      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  if (!props.action.available) {
    if (!props.description) return null;

    return (
      <div className="c-prose" data-color="neutral-200" data-fs="sm" data-my="5">
        {props.description}
      </div>
    );
  }

  return (
    <div data-gap="2" data-my="5" data-stack="y">
      {update.off && (
        <button
          className="c-prose"
          data-color={props.description ? "neutral-200" : "neutral-500"}
          data-cursor="pointer"
          data-fs="sm"
          data-self="start"
          data-ta="start"
          disabled={!props.action.enabled}
          onClick={update.enable}
          title={t("plan.description.label")}
          type="button"
          {...update.props.controller}
        >
          {props.description ?? t("plan.description.placeholder")}
        </button>
      )}

      {update.off && <ActionHint action={props.action} />}

      {update.on && (
        <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...update.props.target}>
          <textarea
            aria-label={t("plan.description.label")}
            className="c-textarea"
            data-width="100%"
            placeholder={t("plan.description.placeholder")}
            rows={3}
            style={{ background: "transparent" }}
            {...bg.Form.textarea(Form.description.pattern)}
            {...description.input.props}
          />

          <div data-cross="center" data-gap="1" data-stack="x">
            <button
              className="c-button"
              data-variant="secondary"
              disabled={description.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ButtonCancel onClick={bg.exec([description.clear, mutation.reset, update.disable])} />

            {mutation.isError && (
              <output data-color="danger-400" data-fs="sm">
                {t("plan.description.error")}
              </output>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
