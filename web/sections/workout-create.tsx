import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import { ActionHint, Select } from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

export function WorkoutCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { plan, workouts } = workoutsRoute.useLoaderData();

  const today = Temporal.Now.plainDateISO().toString();
  const scheduledFor = bg.useDateField({ name: "scheduledFor", defaultValue: today });
  const schedule = bg.useFocusKeyboardShortcut<HTMLInputElement>(ShortcutDefinitions.ScheduleWorkout.trigger);
  const planSectionId = bg.useTextField({ name: "planSectionId", defaultValue: plan?.sections[0]?.id ?? "" });

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
      scheduledFor.clear();

      return router.invalidate({ filter: (route) => route.id === workoutsRoute.id, sync: true });
    },
  });

  return (
    <form data-cross="end" data-gap="3" data-stack="x" onSubmit={mutation.handleSubmit}>
      <div data-gap="1" data-stack="y">
        <label className="c-label" data-variant="inline" {...scheduledFor.label.props}>
          {t("workout.create.date.label")}
        </label>

        <input
          className="c-input"
          ref={schedule.ref}
          type="date"
          {...scheduledFor.input.props}
          max={Temporal.Now.plainDateISO().add({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
          min={Temporal.Now.plainDateISO().subtract({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
        />
      </div>

      {plan && (
        <div data-gap="1" data-stack="y">
          <label className="c-label" data-variant="inline" {...planSectionId.label.props}>
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
        disabled={!workouts.actions.create.enabled || mutation.isLoading}
        type="submit"
      >
        <CalendarPlus data-size="sm" />
        {t("workout.create.cta")}
      </button>

      <div data-mb="2">
        <ActionHint action={workouts.actions.create} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-mb="2">
          {t("workout.create.error")}
        </output>
      )}
    </form>
  );
}
