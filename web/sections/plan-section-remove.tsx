import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CircleAlert, CircleX } from "lucide-react";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { ButtonCancel, ButtonClose } from "../components";
import { planRoute } from "../router";

export function PlanSectionRemove(props: { plan: Plan; section: PlanSectionWithExercises }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const dialog = bg.useToggle({ name: `plan-section-remove-${props.section.id}` });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
      }),
    onSuccess: async () => {
      dialog.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });
    },
  });

  return (
    <>
      <button
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-ml="auto"
        data-variant="ghost"
        onClick={dialog.enable}
        title={t("plan.section.remove.title", { name: props.section.name })}
        type="button"
        {...dialog.props.controller}
      >
        <CircleX data-size="sm" />
      </button>

      <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...dialog}>
        <div data-cross="center" data-main="between" data-stack="x">
          <strong data-color="neutral-100">{t("plan.section.remove.header")}</strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <div
          data-color="danger-400"
          data-cross="center"
          data-fs="sm"
          data-gap="2"
          data-lh="loose"
          data-stack="x"
        >
          <CircleAlert data-size="md" />
          {t("plan.section.remove.info", { name: props.section.name })}
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && (
            <output aria-live="assertive" data-color="danger-400" data-fs="sm">
              {t("plan.section.remove.error")}
            </output>
          )}

          <div data-gap="5" data-main="end" data-stack="x">
            <ButtonCancel onClick={dialog.disable} />

            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("plan.section.remove.cta")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
