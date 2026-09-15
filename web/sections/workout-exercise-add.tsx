import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/workout-exercise-add-form";
import type { ActionState } from "../../modules/action-state";
import type { Workout } from "../../modules/workouts/value-objects/workout";
import {
  ActionHint,
  ButtonClear,
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  ExercisePicker,
} from "../components";
import { workoutRoute } from "../router";

const placeholder = { ...bg.Rhythm().times(3).width, ...bg.Rhythm().times(3).height };
const shrinkable = { minHeight: 0 };

export function WorkoutExerciseAdd(props: Workout & { action: ActionState; first: boolean }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = workoutRoute.useLoaderData();
  const add = bg.useToggle({ name: `workout-exercise-add-${props.id}` });

  const exerciseId = bg.useTextField(Form.exerciseId.field);
  const query = bg.useTextField(Form.query.field);
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/workouts/${props.id}/exercise`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...bg.WeakETag.fromRevision(props.revision) },
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      add.disable();

      await router.invalidate({ filter: (route) => route.id === workoutRoute.id, sync: true });

      bg.Fields.clearAll([exerciseId, query, sets, repsMin, repsMax]);
      context.form?.reset();
    },
  });

  const clear = bg.exec([
    exerciseId.clear,
    query.clear,
    sets.clear,
    repsMin.clear,
    repsMax.clear,
    mutation.reset,
  ]);

  return (
    <>
      <div
        data-bct={props.first ? undefined : "alpha-soft"}
        data-bst={props.first ? undefined : "solid"}
        data-bwt={props.first ? undefined : "hairline"}
        data-cross="center"
        data-gap="3"
        data-pt={props.first ? undefined : "4"}
        data-stack="x"
        data-wrap="nowrap"
      >
        <button
          data-color="neutral-400"
          data-cross="center"
          data-cursor="pointer"
          data-fs="sm"
          data-fw="medium"
          data-gap="3"
          data-grow="1"
          data-hover-color="neutral-0"
          data-stack="x"
          data-wrap="nowrap"
          disabled={!props.action.enabled}
          onClick={add.enable}
          type="button"
          {...add.props.controller}
        >
          <div
            data-bc="neutral-700"
            data-br="sm"
            data-bs="dashed"
            data-bw="hairline"
            data-color="neutral-500"
            data-cross="center"
            data-main="center"
            data-shrink="0"
            data-stack="x"
            style={placeholder}
          >
            <Plus data-size="sm" />
          </div>

          {t("workout.exercise.add.cta")}
        </button>

        <ActionHint action={props.action} data-shrink="0" />
      </div>

      <Dialog {...add}>
        <DialogHeader disabled={mutation.isLoading} onClose={bg.exec([clear, add.disable])}>
          {t("workout.exercise.add.cta")}
        </DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-gap="6"
          data-stack="y"
          data-wrap="nowrap"
          onSubmit={mutation.handleSubmit}
          style={shrinkable}
        >
          <ExercisePicker
            exercises={exercises.data}
            name={exerciseId.input.props.name}
            onChange={exerciseId.set}
            query={query}
            value={exerciseId.value}
          />

          <div data-cross="end" data-gap="4" data-stack="x" data-wrap="nowrap">
            <div data-gap="1" data-stack="y">
              <label className="c-label" {...sets.label.props}>
                {t("workout.exercise.add.sets.label")}
              </label>

              <input
                className="c-input"
                type="number"
                {...Form.sets.pattern}
                {...sets.input.props}
                {...bg.Rhythm().times(5).style.width}
              />
            </div>

            <div data-gap="1" data-stack="y">
              <label className="c-label" {...repsMin.label.props}>
                {t("workout.exercise.add.reps.label")}
              </label>

              <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
                <input
                  className="c-input"
                  type="number"
                  {...Form.repsMin.pattern}
                  {...repsMin.input.props}
                  {...bg.Rhythm().times(5).style.width}
                />

                <div data-color="neutral-400">-</div>

                <input
                  aria-label={t("workout.exercise.add.reps.max.label")}
                  className="c-input"
                  type="number"
                  {...Form.repsMax.pattern}
                  min={repsMin.value}
                  {...repsMax.input.props}
                  {...bg.Rhythm().times(5).style.width}
                />
              </div>
            </div>
          </div>

          {mutation.isError && <DialogError>{t("workout.exercise.add.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={bg.exec([clear, add.disable])}>
            <ButtonClear
              disabled={
                exerciseId.empty && query.empty && sets.unchanged && repsMin.unchanged && repsMax.unchanged
              }
              onClick={clear}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={
                exerciseId.empty || sets.empty || repsMin.empty || repsMax.empty || mutation.isLoading
              }
              type="submit"
            >
              <Plus data-size="sm" />
              {t("workout.exercise.add.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
