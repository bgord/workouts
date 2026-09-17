import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { DateFormat } from "../services/date-format";

const date = { flexShrink: 0, minWidth: 0, width: "auto" };

export function WorkoutReschedule(props: Workout & { action: ActionState }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const router = useRouter();

  const workoutReschedule = bg.useToggle({ name: `workout-reschedule-${props.id}` });

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
      workoutReschedule.disable();

      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (workoutReschedule.off) {
    return (
      <button
        data-color="neutral-500"
        data-cursor="pointer"
        data-fs="xs"
        data-hover-color="neutral-200"
        data-self="start"
        onClick={workoutReschedule.enable}
        title={t("workout.reschedule.cta")}
        type="button"
        {...workoutReschedule.props.controller}
      >
        {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(props.scheduledFor))}
      </button>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-gap="1"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...workoutReschedule.props.target}
    >
      <input
        aria-label={t("workout.reschedule.label")}
        className="c-input"
        data-variant="transparent"
        disabled={!props.action.enabled}
        style={date}
        type="date"
        {...scheduledFor.input.props}
        max={Temporal.Now.plainDateISO().add({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
        min={Temporal.Now.plainDateISO().subtract({ days: WorkoutScheduledForHorizonDaysMax }).toString()}
      />

      <ui.IconButton
        aria-label={t("app.save")}
        disabled={scheduledFor.unchanged || mutation.isLoading}
        title={t("app.save")}
        tone="positive"
        type="submit"
      >
        <Check data-size="sm" />
      </ui.IconButton>

      <ui.IconButton
        aria-label={t("app.cancel")}
        onClick={bg.exec([scheduledFor.clear, mutation.reset, workoutReschedule.disable])}
        title={t("app.cancel")}
      >
        <X data-size="sm" />
      </ui.IconButton>

      <ui.ActionHint {...props.action} data-ml="2" />

      {mutation.isError && <ui.Output data-width="100%">{t("workout.reschedule.error")}</ui.Output>}
    </form>
  );
}
