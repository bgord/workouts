import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import { Form } from "../../app/services/workout-note-form";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutNoteMenuItem(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  /* v8 ignore next */
  if (!workout.actions.noteSet.available || props.on) return null;

  return (
    <bg.MenuItem disabled={!workout.actions.noteSet.enabled} onClick={props.enable}>
      <NotebookPen data-size="sm" />
      {workout.data.note ? t("workout.note.edit.cta") : t("workout.note.add.cta")}
    </bg.MenuItem>
  );
}

export function WorkoutNote(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { workout } = workoutRoute.useLoaderData();

  const workoutNoteUpdate = props;

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
      await router.invalidate({ filter: (match) => match.routeId === workoutRoute.id, sync: true });
    },
  });

  /* v8 ignore next */
  if (!workout.actions.noteSet.available) return null;
  if (workoutNoteUpdate.off && !workout.data.note) return null;

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      {workoutNoteUpdate.off && (
        <>
          <button
            data-color="neutral-300"
            data-cursor="pointer"
            data-fs="sm"
            data-hover-color="neutral-100"
            data-ta="start"
            data-transform="pre-line"
            disabled={!workout.actions.noteSet.enabled}
            onClick={workoutNoteUpdate.enable}
            title={t("workout.note.edit.cta")}
            type="button"
            {...ui.describedByHint(workout.actions.noteSet, "workout-note-hint")}
            {...workoutNoteUpdate.props.controller}
          >
            {workout.data.note}
          </button>

          <ui.ActionHint {...workout.actions.noteSet} id="workout-note-hint" />
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
          <div data-cross="start" data-md-cross="stretch" data-md-stack="y" data-stack="x" {...ui.Gap.inline}>
            <textarea
              aria-label={t("workout.note.label")}
              autoFocus
              className="c-textarea"
              data-grow="1"
              data-minw="0"
              placeholder={t("workout.note.placeholder")}
              style={{ fieldSizing: "content" }}
              {...bg.Form.textarea(Form.note.pattern)}
              {...note.input.props}
              {...metaEnterSubmit}
            />

            <ui.InlineEditActions
              data-md-self="end"
              disabled={note.unchanged || mutation.isLoading}
              onCancel={bg.exec([note.clear, mutation.reset, workoutNoteUpdate.disable])}
            />
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("workout.note.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
