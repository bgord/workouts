import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-create-form";
import * as ui from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanName(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const { toggle } = bg.extractUseToggle(props);

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
      toggle.disable();
      await router.invalidate({
        filter: (match) => match.routeId === planRoute.id || match.routeId === plansRoute.id,
        sync: true,
      });
    },
  });

  const cancel = bg.exec([planName.clear, mutation.reset, toggle.disable]);

  if (!plan.actions.rename.available) {
    return (
      <h1 data-transform="line-clamp" title={plan.data.name}>
        {plan.data.name}
      </h1>
    );
  }

  if (toggle.off) {
    return (
      <h1 aria-label={plan.data.name}>
        <button
          aria-label={t("plan.rename.cta", { name: plan.data.name })}
          data-cursor="pointer"
          data-focus-ring-offset="inset"
          data-maxw="100%"
          data-transform="line-clamp"
          onClick={toggle.enable}
          title={t("plan.rename.cta", { name: plan.data.name })}
          type="button"
          {...toggle.props.controller}
        >
          {plan.data.name}
        </button>
      </h1>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-stack="y"
      onKeyDown={(event) => {
        if (event.key === "Escape") cancel();
      }}
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("plan.rename.label")}
          autoFocus
          className="c-input"
          data-grow="1"
          data-minw="0"
          maxLength={Form.name.pattern.max}
          minLength={Form.name.pattern.min}
          required
          {...planName.input.props}
        />

        <ui.InlineEditActions disabled={planName.unchanged || mutation.isLoading} onCancel={cancel} />
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("plan.rename.error")}
        </output>
      )}
    </form>
  );
}
