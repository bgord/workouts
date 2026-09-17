import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CalendarDays, CalendarPlus, Circle, CircleCheck } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import * as ui from "../components";
import { workoutsRoute } from "../router";
import { DateFormat } from "../services/date-format";

const QUICK_DAYS = 3;

export function WorkoutCreate(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const router = useRouter();
  const navigate = workoutsRoute.useNavigate();
  const { plan, workouts } = workoutsRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);

  const workoutCreateCustomDate = bg.useToggle({ name: "workout-create-custom-date" });

  const today = Temporal.Now.plainDateISO();
  const scheduledFor = bg.useDateField({ name: "scheduledFor", defaultValue: today.toString() });
  const planSectionId = bg.useTextField({ name: "planSectionId", defaultValue: plan?.sections[0]?.id ?? "" });

  const quick = Array.from({ length: QUICK_DAYS }, (_, offset) => today.add({ days: offset }));

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

      toggle.disable();
      scheduledFor.clear();
      workoutCreateCustomDate.disable();

      await navigate({
        params: { workoutId: id },
        search: (prev) => prev,
        to: "/workouts/$workoutId",
      });
      await router.invalidate({ filter: (route) => route.id === workoutsRoute.id, sync: true });
    },
  });

  const label = (date: Temporal.PlainDate, offset: number) => {
    if (offset === 0) return t("workout.create.when.today");
    if (offset === 1) return t("workout.create.when.tomorrow");
    return DateFormat.weekdayWithDay(language, date);
  };

  return (
    <ui.Dialog {...toggle}>
      <ui.DialogHeader disabled={mutation.isLoading} onClose={toggle.disable}>
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
                    <label
                      data-bc={selected ? "brand-500" : "neutral-800"}
                      data-br="md"
                      data-bs="solid"
                      data-bw="hairline"
                      data-cross="center"
                      data-cursor="pointer"
                      data-hover-bc={selected ? "brand-500" : "neutral-600"}
                      data-stack="x"
                      data-wrap="nowrap"
                      {...ui.Spacing.surfaceCompact}
                      {...ui.Gap.related}
                    >
                      <input
                        checked={selected}
                        className="c-visually-hidden"
                        name={planSectionId.input.props.name}
                        onChange={planSectionId.input.props.onChange}
                        type="radio"
                        value={option.id}
                      />

                      {selected ? (
                        <CircleCheck data-color="brand-400" data-shrink="0" data-size="sm" />
                      ) : (
                        <Circle data-color="neutral-600" data-shrink="0" data-size="sm" />
                      )}

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
                        {t("workout.create.section.exercises", { count: option.exerciseInstructions.length })}
                      </ui.Meta>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div data-stack="y" {...ui.Gap.field}>
          <label className="c-label" {...scheduledFor.label.props}>
            {t("workout.create.when.label")}
          </label>

          <div data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
            {quick.map((date, offset) => {
              const selected = workoutCreateCustomDate.off && scheduledFor.value === date.toString();

              return (
                <ui.ChipButton
                  key={date.toString()}
                  onClick={() => {
                    workoutCreateCustomDate.disable();
                    scheduledFor.set(date.toString());
                  }}
                  pressed={selected}
                >
                  {label(date, offset)}
                </ui.ChipButton>
              );
            })}

            <ui.ChipButton
              onClick={workoutCreateCustomDate.enable}
              pressed={workoutCreateCustomDate.on}
              {...workoutCreateCustomDate.props.controller}
            >
              <CalendarDays data-size="xs" />
              {t("workout.create.when.custom")}
            </ui.ChipButton>
          </div>

          {workoutCreateCustomDate.on && (
            <input
              className="c-input"
              data-variant="transparent"
              data-width="100%"
              type="date"
              {...scheduledFor.input.props}
              {...workoutCreateCustomDate.props.target}
              max={today.add({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
              min={today.subtract({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
            />
          )}
        </div>

        {mutation.isError && <ui.DialogError>{t("workout.create.error")}</ui.DialogError>}

        <ui.DialogFooter disabled={mutation.isLoading} onCancel={toggle.disable}>
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
  );
}
