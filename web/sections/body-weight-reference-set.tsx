import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { BodyWeightGoalOptions } from "../../modules/measurements/value-objects/body-weight-goal-options";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { measurementsRoute } from "../router";
import { BodyWeightDecimals, WeightFormat } from "../services/weight-format";

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
        headers: { "Content-Type": "application/json" },
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
      data-cross="center"
      data-gap="2"
      data-grow="1"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
      {...toggle.props.target}
    >
      <div data-color="neutral-100" data-fs="sm" data-fw="medium" data-md-fs="xs" data-transform="nowrap">
        {t("measurements.body_weight.value", {
          weight: WeightFormat.kilograms(props.measurement.weight, BodyWeightDecimals),
        })}
      </div>

      <div data-cross="center" data-ml="auto" data-stack="x" data-wrap="nowrap">
        {goals.map((option) => (
          <button
            aria-pressed={option === goal.value}
            className="c-button"
            data-color={option === goal.value ? "brand-400" : "neutral-300"}
            data-cross="center"
            data-fs="xs"
            data-gap="1"
            data-hover-color="brand-300"
            data-px="2"
            data-stack="x"
            data-variant="ghost"
            key={option}
            onClick={() => goal.set(option)}
            type="button"
          >
            <ui.BodyWeightGoalIcon goal={option} size="xs" />
            {t(`measurements.body_weight.goal.${option}`)}
          </button>
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

      {mutation.isError && <ui.Output>{t("measurements.body_weight.reference.error")}</ui.Output>}
    </form>
  );
}
