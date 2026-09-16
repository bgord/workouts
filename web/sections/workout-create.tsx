import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CalendarDays, CalendarPlus, Circle, CircleCheck } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import { Dialog, DialogError, DialogFooter, DialogHeader } from "../components";
import { workoutsRoute } from "../router";
import { DateFormat } from "../services/date-format";

const QUICK_DAYS = 3;

export function WorkoutCreate(props: { toggle: bg.UseToggleReturnType }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const router = useRouter();
  const navigate = workoutsRoute.useNavigate();
  const { plan, workouts } = workoutsRoute.useLoaderData();

  const today = Temporal.Now.plainDateISO();
  const scheduledFor = bg.useDateField({ name: "scheduledFor", defaultValue: today.toString() });
  const custom = bg.useToggle({ name: "workout-create-custom-date" });
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

      props.toggle.disable();
      scheduledFor.clear();
      custom.disable();

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
    <Dialog {...props.toggle}>
      <DialogHeader disabled={mutation.isLoading} onClose={props.toggle.disable}>
        {t("workout.create.toggle.cta")}
        {plan && (
          <span data-color="neutral-500" data-fw="regular" data-ml="2">
            · {plan.name}
          </span>
        )}
      </DialogHeader>

      <form aria-busy={mutation.isLoading} data-gap="6" data-stack="y" onSubmit={mutation.handleSubmit}>
        {plan && (
          <div data-gap="1-5" data-stack="y">
            <div className="c-label">{t("workout.create.section.label")}</div>

            <ul data-gap="2" data-stack="y">
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
                      data-gap="3"
                      data-hover-bc={selected ? "brand-500" : "neutral-600"}
                      data-p="3"
                      data-stack="x"
                      data-wrap="nowrap"
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

                      <div data-gap="0-5" data-grow="1" data-stack="y" data-transform="truncate">
                        <div data-color="neutral-100" data-fs="sm" data-fw="medium">
                          {option.name}
                        </div>

                        <div data-color="neutral-500" data-fs="xs" data-transform="truncate">
                          {option.exerciseInstructions
                            .map((instruction) => instruction.exercise.name)
                            .join(" · ")}
                        </div>
                      </div>

                      <div
                        data-color="neutral-500"
                        data-fs="xs"
                        data-shrink="0"
                        data-transform="font-variant-numeric"
                      >
                        {t("workout.create.section.exercises", { count: option.exerciseInstructions.length })}
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div data-gap="1-5" data-stack="y">
          <label className="c-label" {...scheduledFor.label.props}>
            {t("workout.create.when.label")}
          </label>

          <div data-gap="2" data-stack="x" data-wrap="wrap">
            {quick.map((date, offset) => {
              const selected = custom.off && scheduledFor.value === date.toString();

              return (
                <button
                  className="c-badge"
                  data-cursor="pointer"
                  data-variant={selected ? "primary" : "outline"}
                  key={date.toString()}
                  onClick={() => {
                    custom.disable();
                    scheduledFor.set(date.toString());
                  }}
                  type="button"
                >
                  {label(date, offset)}
                </button>
              );
            })}

            <button
              className="c-badge"
              data-cursor="pointer"
              data-variant={custom.on ? "primary" : "outline"}
              onClick={custom.enable}
              type="button"
              {...custom.props.controller}
            >
              <CalendarDays data-size="xs" />
              {t("workout.create.when.custom")}
            </button>
          </div>

          {custom.on && (
            <input
              className="c-input"
              data-variant="transparent"
              data-width="100%"
              type="date"
              {...scheduledFor.input.props}
              {...custom.props.target}
              max={today.add({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
              min={today.subtract({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
            />
          )}
        </div>

        {mutation.isError && <DialogError>{t("workout.create.error")}</DialogError>}

        <DialogFooter disabled={mutation.isLoading} onCancel={props.toggle.disable}>
          <button
            className="c-button"
            data-variant="primary"
            disabled={!workouts.actions.create.enabled || scheduledFor.empty || mutation.isLoading}
            type="submit"
          >
            <CalendarPlus data-size="sm" />
            {t("workout.create.cta")}
          </button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
