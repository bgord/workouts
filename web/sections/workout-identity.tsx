import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil } from "lucide-react";
import { WorkoutScheduledForHorizonDaysMax } from "../../modules/workouts/value-objects/workout-scheduled-for-horizon";
import { WorkoutStatusEnum } from "../../modules/workouts/value-objects/workout-status";
import * as ui from "../components";
import { workoutRoute } from "../router";
import { DateFormat } from "../services/date-format";

export function WorkoutIdentity(props: { back: React.ReactNode; menu: React.ReactNode }) {
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
      await router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true });
    },
  });

  const scheduledOn = DateFormat.dayWithWeekday(language, workout.data.scheduledFor);
  const today = DateFormat.todayISO();
  const completed = workout.data.status === WorkoutStatusEnum.completed;

  const date = (
    <>
      <ui.DateTileMonth {...(completed ? { "data-color": "neutral-500" as const } : {})}>
        {DateFormat.shortMonth(language, workout.data.scheduledFor)}
      </ui.DateTileMonth>
      <ui.DateTileDay>{DateFormat.dayOfMonth(language, workout.data.scheduledFor)}</ui.DateTileDay>
      <ui.DateTileWeekday>{DateFormat.shortWeekday(language, workout.data.scheduledFor)}</ui.DateTileWeekday>
    </>
  );

  return (
    <div data-stack="y" {...ui.Gap.related}>
      <div data-cross="center" data-stack="x" {...ui.Gap.related}>
        {props.back}

        {workout.actions.reschedule.available ? (
          <ui.DateTileButton
            aria-label={t("workout.reschedule.cta", { date: scheduledOn })}
            onClick={workoutReschedule.toggle}
            title={t("workout.reschedule.cta", { date: scheduledOn })}
            {...workoutReschedule.props.controller}
          >
            {date}
            <ui.DateTileBadge>
              <Pencil data-size="xs" />
            </ui.DateTileBadge>
          </ui.DateTileButton>
        ) : (
          <ui.DateTile title={scheduledOn}>
            {date}
            {completed && (
              <ui.DateTileBadge
                aria-label={t("workout.status.completed")}
                role="img"
                title={t("workout.status.completed")}
                tone="positive"
              >
                <Check data-size="xs" />
              </ui.DateTileBadge>
            )}
          </ui.DateTile>
        )}

        <div data-grow="1" data-minw="0" data-stack="y" data-gap="0-5">
          <h1 data-transform="line-clamp" title={workout.data.planSectionName}>
            {workout.data.planSectionName}
          </h1>

          <span data-color="neutral-400" data-fs="xs" data-transform="truncate">
            {workout.data.planName}
          </span>
        </div>

        {props.menu}
      </div>

      {workoutReschedule.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="x"
          data-wrap="wrap"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.inline}
          {...ui.describedByHint(workout.actions.reschedule, "workout-reschedule-hint")}
          {...workoutReschedule.props.target}
        >
          <input
            aria-label={t("workout.reschedule.label")}
            className="c-input"
            data-minw="0"
            data-shrink="0"
            data-width="auto"
            disabled={!workout.actions.reschedule.enabled}
            max={DateFormat.addDays(today, WorkoutScheduledForHorizonDaysMax)}
            min={DateFormat.addDays(today, -WorkoutScheduledForHorizonDaysMax)}
            type="date"
            {...scheduledFor.input.props}
          />

          <ui.InlineEditActions
            disabled={!workout.actions.reschedule.enabled || scheduledFor.unchanged || mutation.isLoading}
            onCancel={bg.exec([scheduledFor.clear, mutation.reset, workoutReschedule.disable])}
          />

          <ui.ActionHint {...workout.actions.reschedule} data-ml="2" id="workout-reschedule-hint" />

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger" data-width="100%">
              {t("workout.reschedule.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
