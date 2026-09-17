import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/plan-create-form";
import type { Plan } from "../../modules/plans/value-objects/plan";
import { planRoute, plansRoute } from "../router";

export function PlanRename(props: Plan) {
  const t = bg.useTranslations();
  const router = useRouter();

  const planRename = bg.useToggle({ name: "plan-rename" });

  const planName = bg.useTextField({ ...Form.name.field, defaultValue: props.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/plans/${props.id}/rename`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.revision),
        body: JSON.stringify({ planName: planName.value }),
      }),
    onSuccess: async () => {
      planRename.disable();

      await router.invalidate({
        filter: (route) => route.id === planRoute.id || route.id === plansRoute.id,
        sync: true,
      });
    },
  });

  if (planRename.off) {
    return (
      <button
        data-color="neutral-0"
        data-cursor="pointer"
        data-fs="2xl"
        data-maxw="100%"
        data-md-fs="xl"
        data-transform="truncate"
        onClick={planRename.enable}
        title={t("plan.rename.cta")}
        type="button"
        {...planRename.props.controller}
      >
        <h1 data-fs="2xl" data-fw="black" data-maxw="100%" data-md-fs="xl" data-transform="truncate">
          {props.name}
        </h1>
      </button>
    );
  }

  return (
    <form
      data-gap="2"
      data-grow="1"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...bg.Rhythm().times(0).style.minWidth}
      {...planRename.props.target}
    >
      <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
        <input
          aria-label={t("plan.rename.label")}
          className="c-input"
          data-grow="1"
          data-variant="transparent"
          {...bg.Rhythm().times(0).style.minWidth}
          {...bg.Form.input(Form.name.pattern)}
          {...planName.input.props}
        />

        <button
          aria-label={t("app.save")}
          className="c-button"
          data-color="positive-400"
          data-hover-color="positive-200"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={planName.unchanged || mutation.isLoading}
          title={t("app.save")}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
        >
          <Check data-size="sm" />
        </button>

        <button
          aria-label={t("app.cancel")}
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          onClick={bg.exec([planName.clear, mutation.reset, planRename.disable])}
          title={t("app.cancel")}
          type="button"
          {...bg.Rhythm().times(3).style.width}
        >
          <X data-size="sm" />
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs">
          {t("plan.rename.error")}
        </output>
      )}
    </form>
  );
}
