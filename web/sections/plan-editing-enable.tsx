import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { planRoute, plansRoute } from "../router";

export function PlanEditingEnable(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/editing/enable`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
      }),
    onSuccess: () =>
      router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      }),
  });

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit}>
      <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
        {t("plan.editing.enable.cta")}
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.editing.enable.error")}
        </output>
      )}
    </form>
  );
}
