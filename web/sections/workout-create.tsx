import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { WorkoutDraftLimitForOwnerMax } from "../../modules/workouts/value-objects/workout-draft-limit-for-owner";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import { Select } from "../components";
import { homeRoute } from "../router";

export function WorkoutCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan, workouts } = homeRoute.useLoaderData();

  const today = Temporal.Now.plainDateISO().toString();
  const horizon = Temporal.Now.plainDateISO().add({ days: WorkoutScheduledForHorizonDaysMax }).toString();
  const scheduledFor = bg.useDateField({ name: "scheduledFor", defaultValue: today });
  const planSectionId = bg.useTextField({
    name: "planSectionId",
    defaultValue: plan?.sections[0]?.id ?? "",
  });

  const drafts = workouts.filter((workout) => workout.status === WorkoutStatusEnum.draft).length;

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/workouts/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan?.id,
          planSectionId: planSectionId.value,
          scheduledFor: scheduledFor.value,
        }),
      }),
    onSuccess: () => {
      scheduledFor.set(today);

      return router.invalidate({ filter: (route) => route.id === homeRoute.id, sync: true });
    },
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

        <input className="c-input" type="date" {...scheduledFor.input.props} max={horizon} min={today} />
      </div>

      {plan && (
        <div data-gap="1" data-stack="y">
          <label className="c-label" data-m="0" {...planSectionId.label.props}>
            {plan.name}
          </label>

          <Select {...planSectionId.input.props}>
            {plan.sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </Select>
        </div>
      )}

      <button
        className="c-button"
        data-variant="primary"
        disabled={Boolean(hint) || scheduledFor.empty || planSectionId.empty || mutation.isLoading}
        type="submit"
      >
        {t("workout.create.cta")}
      </button>

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
