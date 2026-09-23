import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/workout-note-form";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutNote() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();

  const workoutNoteUpdate = bg.useToggle({ name: `workout-note-update-${workout.data.id}` });

  const note = bg.useTextField({ ...Form.note.field, defaultValue: workout.data.note ?? "" });

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${workout.data.id}/note`, {
        method: "PATCH",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(workout.data.revision),
        body: JSON.stringify({ note: note.value?.trim() || null }),
      }),
    onSuccess: async () => {
      workoutNoteUpdate.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  if (!workout.actions.noteSet.available) return null;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      {workoutNoteUpdate.off && (
        <>
          <button
            className="c-prose"
            data-color={workout.data.note ? undefined : "neutral-500"}
            data-cursor="pointer"
            data-self="start"
            data-ta="start"
            disabled={!workout.actions.noteSet.enabled}
            onClick={workoutNoteUpdate.enable}
            title={t("workout.note.label")}
            type="button"
            {...workoutNoteUpdate.props.controller}
          >
            {workout.data.note ?? t("workout.note.placeholder")}
          </button>

          <ui.ActionHint {...workout.actions.noteSet} />
        </>
      )}

      {workoutNoteUpdate.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...workoutNoteUpdate.props.target}
        >
          <textarea
            aria-label={t("workout.note.label")}
            className="c-textarea"
            data-width="100%"
            placeholder={t("workout.note.placeholder")}
            rows={3}
            {...bg.Form.textarea(Form.note.pattern)}
            {...note.input.props}
            {...metaEnterSubmit}
          />

          <div data-cross="center" data-stack="x" data-wrap="wrap" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={note.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel onClick={bg.exec([note.clear, mutation.reset, workoutNoteUpdate.disable])} />
          </div>

          {mutation.isError && <ui.Output>{t("workout.note.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
