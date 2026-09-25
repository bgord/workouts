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
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/finalize`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
      }),
    onSuccess: () =>
      router.invalidate({
        filter: (match) => match.routeId === planRoute.id || match.routeId === plansRoute.id,
        sync: true,
      }),
  });

  if (!plan.actions.finalize.available) return null;

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={!plan.actions.finalize.enabled || mutation.isLoading}
        type="submit"
      >
        <Check data-size="sm" />
        {t("plan.finalize.cta")}
      </button>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("plan.finalize.error")}
        </output>
      )}
    </form>
  );
}
