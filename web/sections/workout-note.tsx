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
  const update = bg.useToggle({ name: `workout-note-update-${props.id}` });

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
      update.disable();
      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });
    },
  });

  return (
    <div data-gap="2" data-my="5" data-stack="y">
      {update.off && (
        <button
          className="c-prose"
          data-color={props.note ? "neutral-200" : "neutral-500"}
          data-cursor="pointer"
          data-fs="sm"
          data-self="start"
          data-ta="start"
          disabled={!props.action.enabled}
          onClick={update.enable}
          title={t("workout.note.label")}
          type="button"
          {...update.props.controller}
        >
          {props.note ?? t("workout.note.placeholder")}
        </button>
      )}

      {update.off && <ActionHint action={props.action} />}

      {update.on && (
        <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...update.props.target}>
          <textarea
            aria-label={t("workout.note.label")}
            className="c-textarea"
            data-width="100%"
            placeholder={t("workout.note.placeholder")}
            rows={3}
            style={{ background: "transparent" }}
            {...bg.Form.textarea(Form.note.pattern)}
            {...note.input.props}
          />

          <div data-cross="center" data-gap="3" data-stack="x">
            <button
              className="c-button"
              data-variant="secondary"
              disabled={note.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ButtonCancel onClick={bg.exec([note.clear, mutation.reset, update.disable])} />

            {mutation.isError && (
              <output data-color="danger-400" data-fs="sm">
                {t("workout.note.error")}
              </output>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
