import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CalendarPlus } from "lucide-react";
import * as ui from "../components";
import { workoutsRoute } from "../router";
import * as ShortcutDefinitions from "../services/shortcuts";
import { WorkoutDatePicker } from "./workout-date-picker";

export function WorkoutCreate() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = workoutsRoute.useNavigate();
  const { plan, workouts } = workoutsRoute.useLoaderData();

  const workoutCreate = bg.useToggle({ name: "workout-create" });
  const workoutCreateCustomDate = bg.useToggle({ name: "workout-create-custom-date" });

  const scheduledFor = bg.useDateField({
    name: "scheduledFor",
    defaultValue: Temporal.Now.plainDateISO().toString(),
  });
  const planSectionId = bg.useTextField({ name: "planSectionId", defaultValue: plan?.sections[0]?.id ?? "" });

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/workouts/create", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          planId: plan?.id,
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
      await router.invalidate({ filter: (route) => route.id === workoutsRoute.id, sync: true });
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
      <ui.ActionHint {...workouts.actions.create} data-md-width="100%" />

      <button
        className="c-button"
        data-md-width="100%"
        data-variant="primary"
        disabled={!workouts.actions.create.enabled}
        onClick={workoutCreate.enable}
        type="button"
        {...workoutCreate.props.controller}
      >
        <CalendarPlus data-size="sm" />
        {t("workout.create.toggle.cta")}
      </button>

      <ui.Dialog {...workoutCreate}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={bg.exec([clear, workoutCreate.disable])}>
          {t("workout.create.toggle.cta")}
          {plan && (
            <span data-color="neutral-500" data-fw="regular" data-ml="2">
              · {plan.name}
            </span>
          )}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          {plan && (
            <div data-stack="y" {...ui.Gap.field}>
              <div className="c-label">{t("workout.create.section.label")}</div>

              <ul data-stack="y" {...ui.Gap.cluster}>
                {plan.sections.map((option) => {
                  const selected = option.id === planSectionId.value;

                  return (
                    <li key={option.id}>
                      <ui.RadioTile selected={selected}>
                        <input
                          checked={selected}
                          className="c-visually-hidden"
                          name={planSectionId.input.props.name}
                          onChange={planSectionId.input.props.onChange}
                          type="radio"
                          value={option.id}
                        />

                        <div data-grow="1" data-stack="y" data-transform="truncate" {...ui.Gap.inline}>
                          <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                            {option.name}
                          </div>

                          <ui.Meta truncate>
                            {option.exerciseInstructions
                              .map((instruction) => instruction.exercise.name)
                              .join(" · ")}
                          </ui.Meta>
                        </div>

                        <ui.Meta data-shrink="0">
                          {t("workout.create.section.exercises", {
                            count: option.exerciseInstructions.length,
                          })}
                        </ui.Meta>
                      </ui.RadioTile>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

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
