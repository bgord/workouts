import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { DateFormat } from "../services/date-format";

export function WorkoutScheduledFor() {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();

  const workoutReschedule = bg.useToggle({ name: `workout-reschedule-${workout.data.id}` });

  const scheduledFor = bg.useDateField({
    name: `workout-scheduled-for-${workout.data.id}`,
    defaultValue: workout.data.scheduledFor,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/scheduled-for`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
        body: JSON.stringify({ scheduledFor: scheduledFor.value }),
      }),
    onSuccess: async () => {
      workoutReschedule.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (!workout.actions.reschedule.available) {
    return (
      <ui.Meta>
        {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(workout.data.scheduledFor))}
      </ui.Meta>
    );
  }

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
        {DateFormat.dayWithWeekday(language, Temporal.PlainDate.from(workout.data.scheduledFor))}
      </button>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-cross="center"
      data-stack="x"
      data-wrap="wrap"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.inline}
      {...workoutReschedule.props.target}
    >
      <input
        aria-label={t("workout.reschedule.label")}
        className="c-input"
        data-minw="0"
        data-shrink="0"
        data-variant="transparent"
        data-width="auto"
        disabled={!workout.actions.reschedule.enabled}
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

      <ui.ActionHint {...workout.actions.reschedule} data-ml="2" />

      {mutation.isError && <ui.Output data-width="100%">{t("workout.reschedule.error")}</ui.Output>}
    </form>
  );
}
