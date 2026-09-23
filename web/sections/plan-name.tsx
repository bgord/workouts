import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-create-form";
import * as ui from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanName() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planRename = bg.useToggle({ name: "plan-rename" });

  const planName = bg.useTextField({ ...Form.name.field, defaultValue: plan.data.name });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/rename`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
        body: JSON.stringify({ planName: planName.value }),
      }),
    onSuccess: async () => {
      planRename.disable();
      await router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      });
    },
  });

  if (!plan.actions.rename.available) return <h1 data-minw="0">{plan.data.name}</h1>;

  if (planRename.off) {
    return (
      <h1 data-minw="0">
        <button
          data-cursor="pointer"
          data-maxw="100%"
          data-transform="truncate"
          onClick={planRename.enable}
          title={t("plan.rename.cta")}
          type="button"
          {...planRename.props.controller}
        >
          {plan.data.name}
        </button>
      </h1>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-grow="1"
      data-minw="0"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...planRename.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("plan.rename.label")}
          className="c-input"
          data-grow="1"
          data-minw="0"
          {...bg.Form.input(Form.name.pattern)}
          {...planName.input.props}
        />

        <ui.IconButton
          aria-label={t("app.save")}
          disabled={planName.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>

        <ui.IconButton
          aria-label={t("app.cancel")}
          onClick={bg.exec([planName.clear, mutation.reset, planRename.disable])}
          title={t("app.cancel")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      {mutation.isError && <ui.Output>{t("plan.rename.error")}</ui.Output>}
    </form>
  );
}
