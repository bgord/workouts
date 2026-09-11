import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/workout-note-form";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import { ActionHint, ButtonCancel } from "../components";
import { workoutRoute } from "../router";

export function WorkoutNote(props: Workout & { action: ActionState }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const focus = bg.useToggle({ name: `workout-note-focus-${props.id}` });

  const note = bg.useTextField({ ...Form.note.field, defaultValue: props.note ?? "" });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.id}/note`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.revision) },
        body: JSON.stringify({ note: note.value?.trim() || null }),
      }),
    onSuccess: async () => {
      focus.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  return (
    <form
      data-gap="3"
      data-mt="2"
      data-stack="y"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) focus.disable();
      }}
      onFocus={focus.enable}
      onSubmit={mutation.handleSubmit}
    >
      <textarea
        aria-label={t("workout.note.label")}
        className="c-textarea"
        data-bc="alpha-subtle"
        data-bg="alpha-subtle"
        data-shadow="none"
        disabled={!props.action.enabled}
        placeholder={t("workout.note.placeholder")}
        rows={2}
        {...bg.Form.textarea(Form.note.pattern)}
        {...note.input.props}
      />

      <ActionHint action={props.action} />

      {(focus.on || note.changed) && (
        <div data-cross="center" data-gap="1" data-stack="x">
          <button
            className="c-button"
            data-variant="secondary"
            disabled={note.unchanged || mutation.isLoading}
            type="submit"
          >
            {t("app.save")}
          </button>

          <ButtonCancel onClick={bg.exec([note.clear, mutation.reset, focus.disable])} />

          {mutation.isError && (
            <output data-color="danger-400" data-fs="sm">
              {t("workout.note.error")}
            </output>
          )}
        </div>
      )}
    </form>
  );
}
