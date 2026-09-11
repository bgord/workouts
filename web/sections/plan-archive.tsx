import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Archive } from "lucide-react";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo } from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanArchive(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();
  const dialog = bg.useToggle({ name: "plan-archive" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/archive`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
      }),
    onSuccess: async () => {
      dialog.disable();
      await router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      });
    },
  });

  return (
    <>
      <button
        aria-label={t("plan.archive.cta")}
        className="c-button"
        data-color="neutral-400"
        data-hover-color="neutral-0"
        data-variant="ghost"
        onClick={dialog.enable}
        title={t("plan.archive.header")}
        type="button"
        {...dialog.props.controller}
      >
        <Archive data-size="sm" />
      </button>

      <Dialog {...dialog}>
        <DialogHeader disabled={mutation.isLoading} onClose={dialog.disable}>
          {t("plan.archive.header")}
        </DialogHeader>

        <DialogInfo variant="neutral">{t("plan.archive.info", { name: props.name })}</DialogInfo>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("plan.archive.error")}</DialogError>}

          <DialogFooter onCancel={dialog.disable}>
            <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
              {t("plan.archive.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
