import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-create-form";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { planRoute, plansRoute } from "../router";

export function PlanRename(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();

  const planName = bg.useTextField({ ...Form.name.field, defaultValue: props.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/rename`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
        body: JSON.stringify({ planName: planName.value }),
      }),
    onSuccess: () =>
      router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      }),
  });

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <label className="c-label" data-m="0" {...planName.label.props}>
          {t("plan.rename.label")}
        </label>

        <input className="c-input" {...bg.Form.input(Form.name.pattern)} {...planName.input.props} />

        {planName.changed && (
          <div data-gap="3" data-stack="x">
            <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
              {t("plan.rename.cta")}
            </button>

            <button
              className="c-button"
              data-variant="bare"
              onClick={bg.exec([planName.clear, mutation.reset])}
              type="button"
            >
              {t("app.clear")}
            </button>
          </div>
        )}
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.rename.error")}
        </output>
      )}
    </form>
  );
}
