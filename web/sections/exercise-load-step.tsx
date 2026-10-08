import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseLoadStepOptions } from "../../modules/exercises/value-objects/exercise-load-step-options";
import * as ui from "../components";
import { exerciseRoute } from "../router";
import { ExerciseLoadStepChoice } from "../services/exercise-load-step-choice";

export function ExerciseLoadStep() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseLoadStepSet = bg.useToggle({ name: "exercise-load-step-set" });

  const loadStep = bg.useTextField<ExerciseLoadStepOptions>({
    ...Form.loadStep.field,
    defaultValue: exercise.data.loadStep,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}/load-step`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ loadStep: loadStep.value }),
      }),
    onSuccess: async () => {
      exerciseLoadStepSet.disable();
      await router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });
    },
  });

  const label = t(`exercise.load_step.${exercise.data.loadStep}`);

  if (exercise.actions.loadStepSet.available && exerciseLoadStepSet.on) {
    return (
      <form
        aria-busy={mutation.isLoading}
        data-stack="y"
        onSubmit={mutation.handleSubmit}
        {...ui.Gap.cluster}
        {...exerciseLoadStepSet.props.target}
      >
        <div data-cross="end" data-stack="x" data-wrap="wrap" {...ui.Gap.inline}>
          <ui.ExerciseLoadStepPicker
            disabled={mutation.isLoading}
            field={loadStep}
            options={ExerciseLoadStepChoice.options(exercise.data.resistance)}
            value={loadStep.value ?? exercise.data.loadStep}
          />

          <ui.InlineEditActions
            disabled={loadStep.unchanged || mutation.isLoading}
            onCancel={bg.exec([loadStep.clear, mutation.reset, exerciseLoadStepSet.disable])}
          />
        </div>

        {mutation.isError && (
          <output aria-live="assertive" data-tone="danger">
            {t("exercise.load_step.update.error")}
          </output>
        )}
      </form>
    );
  }

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("exercise.load_step.label")}</h3>

      {!exercise.actions.loadStepSet.available && <p>{label}</p>}

      {exercise.actions.loadStepSet.available && (
        <p>
          <button
            aria-label={t("exercise.load_step.update.cta", { loadStep: label })}
            data-cursor="pointer"
            onClick={exerciseLoadStepSet.enable}
            title={t("exercise.load_step.update.cta", { loadStep: label })}
            type="button"
            {...exerciseLoadStepSet.props.controller}
          >
            {label}
          </button>
        </p>
      )}
    </div>
  );
}
