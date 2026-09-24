import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Archive } from "lucide-react";
import * as ui from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanArchive() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan } = planRoute.useLoaderData();

  const planArchive = bg.useToggle({ name: "plan-archive" });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}/archive`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
      }),
    onSuccess: async () => {
      planArchive.disable();
      await router.invalidate({
        filter: (match) => match.routeId === planRoute.id || match.routeId === plansRoute.id,
        sync: true,
      });
    },
  });

  if (!plan.actions.archive.available) return null;

  return (
    <>
      <ui.IconButton
        aria-label={t("plan.archive.cta")}
        onClick={planArchive.enable}
        title={t("plan.archive.header")}
        {...planArchive.props.controller}
      >
        <Archive data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...planArchive}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={planArchive.disable}>
          {t("plan.archive.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("plan.archive.info", { name: plan.data.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="restorable" />
        </ui.DialogBody>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("plan.archive.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={planArchive.disable}>
            <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
              {t("plan.archive.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
