import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import * as ui from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanEditingEnable() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/editing/enable`, {
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

  if (!plan.actions.editingEnable.available) return null;

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={!plan.actions.editingEnable.enabled || mutation.isLoading}
        type="submit"
      >
        <Pencil data-size="sm" />
        {t("plan.editing.enable.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("plan.editing.enable.error")}</ui.Output>}
    </form>
  );
}
