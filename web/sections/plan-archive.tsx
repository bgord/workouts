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
    perform: async () =>
      fetch(`/api/plans/${plan.data.id}/archive`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
      }),
    onSuccess: async () => {
      planArchive.disable();
      await router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      });
    },
  });

  if (!plan.actions.archive.available) return null;

  return (
    <>
      <button
        aria-label={t("plan.archive.cta")}
        className="c-button"
        data-color="neutral-400"
        data-hover-color="neutral-0"
        data-variant="ghost"
        onClick={planArchive.enable}
        title={t("plan.archive.header")}
        type="button"
        {...planArchive.props.controller}
      >
        <Archive data-size="sm" />
      </button>

      <ui.Dialog {...planArchive}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={planArchive.disable}>
          {t("plan.archive.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Gap.related}>
          <ui.DialogInfo>{t("plan.archive.info", { name: plan.data.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="restorable" />
        </div>

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
