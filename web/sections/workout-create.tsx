import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import { Select } from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";

const getOffsetDateISO = (days: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
};

export function WorkoutCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = workoutsRoute.useNavigate();
  const { plan, workouts } = workoutsRoute.useLoaderData();

  const today = new Date().toISOString().slice(0, 10);
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
    onSuccess: async (response) => {
      const { id } = await response.json();

      scheduledFor.clear();

      await navigate({
        params: { workoutId: id },
        search: (prev) => ({ section: prev.section }),
        to: "/workouts/$workoutId",
      });
      await router.invalidate({ filter: (route) => route.id === workoutsRoute.id, sync: true });
    },
  });

  return (
    <form
      className="c-card"
      data-cross="end"
      data-gap="3"
      data-md-cross="start"
      data-md-p="2-5"
      data-md-stack="y"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
    >
      <div data-gap="1" data-md-width="100%" data-stack="y">
        <label className="c-label" {...scheduledFor.label.props}>
          {t("workout.create.date.label")}
        </label>

        <input
          className="c-input"
          data-md-width="100%"
          ref={schedule.ref}
          type="date"
          {...scheduledFor.input.props}
          max={getOffsetDateISO(WorkoutScheduledForHorizonDaysMax)}
          min={getOffsetDateISO(-WorkoutScheduledForHorizonDaysMax)}
        />
      </div>

      {plan && (
        <div data-gap="1" data-grow="1" data-md-width="100%" data-stack="y">
          <div data-cross="baseline" data-gap="2" data-stack="x">
            <label className="c-label" {...planSectionId.label.props}>
              {t("workout.create.section.label")}
            </label>

            <span data-color="neutral-500" data-fs="xs" data-transform="truncate">
              {t("workout.create.plan", { name: plan.name })}
            </span>
          </div>

          <Select data-md-width="100%" {...planSectionId.input.props}>
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
        data-md-width="100%"
        data-variant="secondary"
        disabled={!workouts.actions.create.enabled || mutation.isLoading}
        type="submit"
      >
        <CalendarPlus data-size="sm" />
        {t("workout.create.cta")}
      </button>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm" data-mb="2">
          {t("workout.create.error")}
        </output>
      )}
    </form>
  );
}
