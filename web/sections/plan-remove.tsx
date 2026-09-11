import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CircleAlert, Trash2 } from "lucide-react";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ButtonCancel, ButtonClose } from "../components";
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

      <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...dialog}>
        <div data-cross="center" data-main="between" data-stack="x">
          <strong data-color="neutral-100">{t("plan.remove.header")}</strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <div
          data-color="danger-400"
          data-cross="center"
          data-fs="sm"
          data-gap="3"
          data-lh="loose"
          data-stack="x"
          data-wrap="nowrap"
        >
          <CircleAlert data-size="md" />
          {t("plan.remove.info", { name: props.name })}
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && (
            <output
              aria-live="assertive"
              data-color="danger-400"
              data-cross="center"
              data-fs="sm"
              data-gap="3"
              data-stack="x"
            >
              <CircleAlert data-size="md" />
              {t("plan.remove.error")}
            </output>
          )}

          <div data-gap="1" data-main="end" data-stack="x">
            <ButtonCancel onClick={dialog.disable} />

            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("plan.remove.cta")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
