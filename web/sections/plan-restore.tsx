import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ArchiveRestore } from "lucide-react";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { Output } from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanRestore(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/restore`, {
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
      <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
        <ArchiveRestore data-size="sm" />
        {t("plan.restore.cta")}
      </button>

      {mutation.isError && <Output>{t("plan.restore.error")}</Output>}
    </form>
  );
}
