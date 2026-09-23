import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { measurementsRoute } from "../router";

const goals = [BodyWeightGoalOptions.bulk, BodyWeightGoalOptions.cut, BodyWeightGoalOptions.maintain];

export function BodyWeightReferenceSet(
  props: { measurement: BodyWeightMeasurement } & bg.UseToggleReturnType,
) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const goal = bg.useTextField<BodyWeightGoalOptions>({
    name: `reference-goal-${props.measurement.id}`,
    defaultValue: props.measurement.reference ? props.measurement.goal : undefined,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-weight/measurement/${props.measurement.id}/reference`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ goal: goal.value }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  if (toggle.off) return null;

  return (
    <form
      aria-busy={mutation.isLoading}
      data-grow="1"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
      {...toggle.props.target}
    >
      <div data-color="neutral-100" data-fs="sm" data-fw="medium" data-md-fs="xs" data-transform="nowrap">
        <ui.BodyWeightValue weight={props.measurement.weight} />
      </div>

      <div data-ml="auto" data-stack="x" data-wrap="wrap" {...ui.Gap.inline}>
        {goals.map((option) => (
          <ui.ChipButton key={option} onClick={() => goal.set(option)} pressed={option === goal.value}>
            <ui.BodyWeightGoalIcon goal={option} size="xs" />
            {t(`measurements.body_weight.goal.${option}`)}
          </ui.ChipButton>
        ))}
      </div>

      <ui.IconButton
        aria-label={t("app.save")}
        disabled={goal.empty || goal.unchanged || mutation.isLoading}
        title={t("app.save")}
        tone="positive"
        type="submit"
      >
        <Check data-size="sm" />
      </ui.IconButton>

      <ui.IconButton
        aria-label={t("app.cancel")}
        onClick={bg.exec([goal.clear, mutation.reset, toggle.disable])}
        title={t("app.cancel")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      {mutation.isError && (
        <ui.Output data-width="100%">{t("measurements.body_weight.reference.error")}</ui.Output>
      )}
    </form>
  );
}
