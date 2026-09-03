import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { planRoute, plansRoute } from "../router";

export function PlanFinalize(props: Plan) {
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

  const empty = props.sections.filter((section) => section.exerciseInstructions.length === 0);
  const blocked = props.sections.length === 0 || empty.length > 0;

  const hint =
    props.sections.length === 0
      ? t("plan.finalize.blocked.no_sections")
      : t("plan.finalize.blocked.empty_sections", { names: empty.map((section) => section.name).join(", ") });

  return (
    <form data-cross="center" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <button
        className="c-button"
        data-variant="primary"
        disabled={blocked || mutation.isLoading}
        type="submit"
      >
        {t("plan.finalize.cta")}
      </button>

      {blocked && (
        <div data-color="neutral-500" data-fs="sm">
          {hint}
        </div>
      )}

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.finalize.error")}
        </output>
      )}
    </form>
  );
}
