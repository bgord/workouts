import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import * as ui from "../components";
import { planRoute, plansRoute } from "../router";

export function PlanRemove() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = planRoute.useNavigate();
  const { plan } = planRoute.useLoaderData();

  const planRemove = bg.useToggle({ name: "plan-remove" });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${plan.data.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(plan.data.revision),
      }),
    onSuccess: async () => {
      planRemove.disable();
      await navigate({ to: "/plans" });
      await router.invalidate({ filter: (route) => route.id === plansRoute.id, sync: true });
    },
  });

  if (!plan.actions.remove.available) return null;

  return (
    <>
      <button
        aria-label={t("plan.remove.cta")}
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-variant="ghost"
        onClick={planRemove.enable}
        title={t("plan.remove.header")}
        type="button"
        {...planRemove.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <ui.Dialog {...planRemove}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={planRemove.disable}>
          {t("plan.remove.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Gap.related}>
          <ui.DialogInfo>{t("plan.remove.info", { name: plan.data.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
          {mutation.isError && <ui.DialogError>{t("plan.remove.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={planRemove.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("plan.remove.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
