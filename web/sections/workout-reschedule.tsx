import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { DateFormat } from "../../app/services/date-format";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import { ActionHints, ButtonCancel } from "../components";
import { workoutRoute } from "../router";

export function WorkoutReschedule(props: Workout & { action: ActionState }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const router = useRouter();
  const reschedule = bg.useToggle({ name: `workout-reschedule-${props.id}` });

  const scheduledFor = bg.useDateField({
    name: `workout-scheduled-for-${props.id}`,
    defaultValue: props.scheduledFor,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.id}/scheduled-for`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.revision) },
        body: JSON.stringify({ scheduledFor: scheduledFor.value }),
      }),
    onSuccess: async () => {
      reschedule.disable();

      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (reschedule.off) {
    return (
      <button
        data-color="neutral-400"
        data-cursor="pointer"
        data-fs="sm"
        data-hover-color="neutral-0"
        onClick={reschedule.enable}
        title={t("workout.reschedule.cta")}
        type="button"
        {...reschedule.props.controller}
      >
        {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.scheduledFor))}
      </button>
    );
  }

  return (
    <form
      data-cross="center"
      data-gap="2"
      data-stack="x"
      onSubmit={mutation.handleSubmit}
      {...reschedule.props.target}
    >
      <input
        aria-label={t("workout.reschedule.label")}
        className="c-input"
        data-fs="sm"
        disabled={!props.action.enabled}
        type="date"
        {...scheduledFor.input.props}
        max={Temporal.Now.plainDateISO().add({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
        min={Temporal.Now.plainDateISO().toString()}
      />

      <button
        className="c-button"
        data-variant="secondary"
        disabled={scheduledFor.unchanged || mutation.isLoading}
        type="submit"
      >
        {t("app.save")}
      </button>

      <ButtonCancel onClick={bg.exec([scheduledFor.clear, mutation.reset, reschedule.disable])} />

      <ActionHints action={props.action} />

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("workout.reschedule.error")}
        </output>
      )}
    </form>
  );
}
