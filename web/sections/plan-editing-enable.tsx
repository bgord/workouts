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
    perform: async () =>
      fetch(`/api/plans/${plan.data.id}/editing/enable`, {
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

  if (!plan.actions.editingEnable.available) return null;

  return (
    <form data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
        <Pencil data-size="sm" />
        {t("plan.editing.enable.cta")}
      </button>

      {mutation.isError && <ui.Output>{t("plan.editing.enable.error")}</ui.Output>}
    </form>
  );
}
