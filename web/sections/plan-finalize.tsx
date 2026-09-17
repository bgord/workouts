import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";
import * as ui from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanFinalize() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${plan.data.id}/finalize`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
      }),
    onSuccess: () =>
      router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      }),
  });

  if (!plan.actions.finalize.available) return null;

  return (
    <form
      data-cross="center"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.related}
    >
      <button
        className="c-button"
        data-variant="primary"
        disabled={!plan.actions.finalize.enabled || mutation.isLoading}
        type="submit"
      >
        <Check data-size="sm" />
        {t("plan.finalize.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("plan.finalize.error")}</ui.Output>}
    </form>
  );
}
