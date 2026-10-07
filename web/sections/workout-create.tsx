import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import * as ui from "../components";
import { useToday } from "../hooks/use-time-zone";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { WorkoutDatePicker } from "./workout-date-picker";
import { WorkoutSectionPicker } from "./workout-section-picker";

export function WorkoutCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = workoutsRoute.useNavigate();
  const { workouts } = workoutsRoute.useLoaderData();

  const workoutCreate = bg.useToggle({ name: "workout-create" });
  const workoutCreateCustomDate = bg.useToggle({ name: "workout-create-custom-date" });

  const today = useToday();
  const scheduledFor = bg.useDateField({ name: "scheduledFor", defaultValue: today });
  const planSectionId = bg.useTextField({
    name: "planSectionId",
    defaultValue: workouts.plan?.sections[0]?.id ?? "",
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/workouts/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          planId: workouts.plan?.id,
          planSectionId: planSectionId.value,
          scheduledFor: scheduledFor.value,
        }),
      }),
    onSuccess: async (response) => {
      const { id } = await response.json();

      workoutCreate.disable();
      clear();

      await navigate({
        params: { workoutId: id },
        search: (prev) => prev,
        to: "/workouts/$workoutId",
      });
      await router.invalidate({ filter: (match) => match.routeId === workoutsRoute.id, sync: true });
    },
  });

  const clear = bg.exec([
    planSectionId.clear,
    scheduledFor.clear,
    workoutCreateCustomDate.disable,
    mutation.reset,
  ]);

  bg.useShortcuts({
    [ShortcutDefinitions.ScheduleWorkout.trigger]: () => {
      if (workouts.actions.create.enabled) workoutCreate.enable();
    },
  });

  return (
    <>
      <ui.ActionHint {...workouts.actions.create} data-md-width="100%" id="workout-create-hint" />

      <button
        className="c-button"
        data-md-width="100%"
        data-variant="primary"
        disabled={!workouts.actions.create.enabled}
        onClick={workoutCreate.enable}
        type="button"
        {...ui.describedByHint(workouts.actions.create, "workout-create-hint")}
        {...workoutCreate.props.controller}
      >
        <CalendarPlus data-size="sm" />
        {t("workout.create.toggle.cta")}
      </button>

      <ui.Dialog {...workoutCreate}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={bg.exec([clear, workoutCreate.disable])}>
          {t("workout.create.toggle.cta")}
          {workouts.plan && <small data-ml="2">· {workouts.plan.name}</small>}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          {workouts.plan && <WorkoutSectionPicker field={planSectionId} sections={workouts.plan.sections} />}

          <WorkoutDatePicker field={scheduledFor} {...workoutCreateCustomDate} />

          {mutation.isError && <ui.DialogError>{t("workout.create.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={bg.exec([clear, workoutCreate.disable])}>
            <ui.ButtonClear
              disabled={bg.Fields.allUnchanged([planSectionId, scheduledFor]) && workoutCreateCustomDate.off}
              onClick={clear}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={!workouts.actions.create.enabled || scheduledFor.empty || mutation.isLoading}
              type="submit"
            >
              <CalendarPlus data-size="sm" />
              {t("workout.create.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
