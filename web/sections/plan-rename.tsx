import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-create-form";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ButtonCancel } from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanRename(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();
  const rename = bg.useToggle({ name: "plan-rename" });

  const planName = bg.useTextField({ ...Form.name.field, defaultValue: props.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/rename`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
        body: JSON.stringify({ planName: planName.value }),
      }),
    onSuccess: async () => {
      rename.disable();

      await router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      });
    },
  });

  if (rename.off) {
    return (
      <h1 data-maxw="100%" data-transform="truncate">
        <button
          data-color="neutral-0"
          data-cursor="pointer"
          data-fs="2xl"
          data-fw="black"
          data-maxw="100%"
          data-md-fs="xl"
          data-transform="truncate"
          onClick={rename.enable}
          title={t("plan.rename.cta")}
          type="button"
          {...rename.props.controller}
        >
          {props.name}
        </button>
      </h1>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...rename.props.target}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          aria-label={t("plan.rename.label")}
          className="c-input"
          {...bg.Form.input(Form.name.pattern)}
          {...planName.input.props}
        />

        <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
          {t("app.save")}
        </button>

        <ButtonCancel onClick={bg.exec([planName.clear, mutation.reset, rename.disable])} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.rename.error")}
        </output>
      )}
    </form>
  );
}
