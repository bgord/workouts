import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import { WorkoutDraftLimitForOwnerMax } from "../../modules/workouts/value-objects/workout-draft-limit-for-owner";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { homeRoute } from "../router";

export function WorkoutCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plans, workouts } = homeRoute.useLoaderData();

  const today = Temporal.Now.plainDateISO().toString();
  const scheduledFor = bg.useDateField({ name: "scheduledFor", defaultValue: today });

  const plan = plans.find((plan) => plan.status === PlanStatusEnum.finalized);
  const drafts = workouts.filter((workout) => workout.status === WorkoutStatusEnum.draft).length;

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/workouts/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan?.id, scheduledFor: scheduledFor.value }),
      }),
    onSuccess: () => router.invalidate({ filter: (route) => route.id === homeRoute.id, sync: true }),
  });

  const hint = !plan
    ? t("workout.create.blocked.no_finalized_plan")
    : drafts >= WorkoutDraftLimitForOwnerMax
      ? t("workout.create.blocked.draft_limit")
      : undefined;

  return (
    <form data-cross="end" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <div data-gap="1" data-stack="y">
        <label className="c-label" data-m="0" {...scheduledFor.label.props}>
          {t("workout.create.date.label")}
        </label>

        <input className="c-input" min={today} type="date" {...scheduledFor.input.props} />
      </div>

      <button
        className="c-button"
        data-variant="primary"
        disabled={Boolean(hint) || scheduledFor.empty || mutation.isLoading}
        type="submit"
      >
        {t("workout.create.cta")}
      </button>

      {plan && !hint && (
        <div data-color="neutral-500" data-fs="sm" data-mb="2">
          {t("workout.create.plan", { name: plan.name })}
        </div>
      )}

      {hint && (
        <div data-color="neutral-500" data-fs="sm" data-mb="2">
          {hint}
        </div>
      )}

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-mb="2">
          {t("workout.create.error")}
        </output>
      )}
    </form>
  );
}
