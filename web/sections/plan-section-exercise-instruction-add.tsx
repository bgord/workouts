import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/plan-section-exercise-instruction-add-form";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { ButtonCancel, Select } from "../components";
import { planRoute } from "../router";

export function PlanSectionExerciseInstructionAdd(props: { plan: Plan; section: PlanSectionWithExercises }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = planRoute.useLoaderData();
  const add = bg.useToggle({ name: `plan-section-exercise-instruction-add-${props.section.id}` });

  const exerciseId = bg.useTextField({ ...Form.exerciseId.field, defaultValue: exercises[0]?.id ?? "" });
  const sets = bg.useNumberField(Form.sets.field);
  const repsMin = bg.useNumberField(Form.repsMin.field);
  const repsMax = bg.useNumberField(Form.repsMax.field);

  const fields = [exerciseId, sets, repsMin, repsMax];

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/plans/${props.plan.id}/section/${props.section.id}/exercise-instruction`, {
        method: "POST",
        credentials: "include",
        headers: bg.WeakETag.fromRevision(props.plan.revision),
        body: JSON.stringify({
          exerciseId: exerciseId.value,
          sets: sets.value,
          reps: { min: repsMin.value, max: repsMax.value },
        }),
      }),
    onSuccess: async (_, context) => {
      add.disable();

      await router.invalidate({ filter: (route) => route.id === planRoute.id, sync: true });

      bg.Fields.clearAll(fields);
      context.form?.reset();
    },
  });

  if (add.off) {
    return (
      <button
        className="c-button"
        data-mr="auto"
        data-variant="bare"
        onClick={add.enable}
        type="button"
        {...add.props.controller}
      >
        {t("plan.section.exercise.add.cta")}
      </button>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...add.props.target}>
      <div data-cross="end" data-gap="3" data-stack="x">
        <div data-cross="start" data-gap="1" data-stack="y">
          <label className="c-label" {...exerciseId.label.props}>
            {t("plan.section.exercise.add.exercise.label")}
          </label>

          <Select {...exerciseId.input.props}>
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.name}
              </option>
            ))}
          </Select>
        </div>

        <div data-cross="start" data-gap="1" data-stack="y">
          <label className="c-label" {...sets.label.props}>
            {t("plan.section.exercise.add.sets.label")}
          </label>

          <input
            className="c-input"
            type="number"
            {...Form.sets.pattern}
            {...sets.input.props}
            {...bg.Rhythm().times(5).style.width}
          />
        </div>

        <div data-cross="start" data-gap="1" data-stack="y">
          <label className="c-label" {...repsMin.label.props}>
            {t("plan.section.exercise.add.reps.label")}
          </label>

          <div data-cross="center" data-gap="2" data-stack="x">
            <input
              className="c-input"
              type="number"
              {...Form.repsMin.pattern}
              {...repsMin.input.props}
              {...bg.Rhythm().times(5).style.width}
            />

            <div data-color="neutral-500">-</div>

            <input
              aria-label={t("plan.section.exercise.add.reps.max.label")}
              className="c-input"
              type="number"
              {...Form.repsMax.pattern}
              min={repsMin.value}
              {...repsMax.input.props}
              {...bg.Rhythm().times(5).style.width}
            />
          </div>
        </div>

        <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
          {t("app.save")}
        </button>

        <ButtonCancel onClick={bg.exec([mutation.reset, add.disable])} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("plan.section.exercise.add.error")}
        </output>
      )}
    </form>
  );
}
