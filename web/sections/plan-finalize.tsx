import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ActionHint } from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanFinalize(props: Plan & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/finalize`, {
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
    <form data-cross="center" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={!props.action.enabled || mutation.isLoading}
        type="submit"
      >
        <Check data-size="sm" />
        {t("plan.finalize.cta")}
      </button>

      <ActionHint action={props.action} />

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.finalize.error")}
        </output>
      )}
    </form>
  );
}
