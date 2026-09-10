import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Archive, CircleAlert } from "lucide-react";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { ButtonCancel, ButtonClose } from "../components";
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
        className="c-button"
        data-variant="bare"
        onClick={dialog.enable}
        type="button"
        {...dialog.props.controller}
      >
        <Archive data-size="sm" />
        {t("plan.archive.cta")}
      </button>

      <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...dialog}>
        <div data-main="between" data-stack="x">
          <strong data-color="neutral-100">{t("plan.archive.header")}</strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <div data-color="neutral-300" data-fs="sm" data-lh="loose">
          {t("plan.archive.info", { name: props.name })}
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
              {t("plan.archive.error")}
            </output>
          )}

          <div data-gap="5" data-main="end" data-stack="x">
            <ButtonCancel onClick={dialog.disable} />

            <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
              {t("plan.archive.cta")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
