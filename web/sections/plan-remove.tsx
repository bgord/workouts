import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo } from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanRemove(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = planRoute.useNavigate();
  const dialog = bg.useToggle({ name: "plan-remove" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
      }),
    onSuccess: async () => {
      dialog.disable();
      await navigate({ to: "/plans" });
      await router.invalidate({ filter: (route) => route.id === plansRoute.id, sync: true });
    },
  });

  return (
    <>
      <button
        aria-label={t("plan.remove.cta")}
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-variant="ghost"
        onClick={dialog.enable}
        title={t("plan.remove.header")}
        type="button"
        {...dialog.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <Dialog {...dialog}>
        <DialogHeader disabled={mutation.isLoading} onClose={dialog.disable}>
          {t("plan.remove.header")}
        </DialogHeader>

        <DialogInfo variant="danger">{t("plan.remove.info", { name: props.name })}</DialogInfo>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("plan.remove.error")}</DialogError>}

          <DialogFooter onCancel={dialog.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("plan.remove.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
