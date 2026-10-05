import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseResistance() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseResistanceChange = bg.useToggle({ name: "exercise-resistance-change" });

  const resistance = bg.useTextField<ExerciseResistanceOptions>({
    ...Form.resistance.field,
    defaultValue: exercise.data.resistance,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}/resistance`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ resistance: resistance.value }),
      }),
    onSuccess: async () => {
      exerciseResistanceChange.disable();
      await router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });
    },
  });

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("exercise.resistance.label")}</h3>

      {!exercise.actions.resistanceChange.available && (
        <p>{t(`exercise.resistance.${exercise.data.resistance}`)}</p>
      )}

      {exercise.actions.resistanceChange.available && exerciseResistanceChange.off && (
        <button
          data-cursor="pointer"
          data-self="start"
          data-ta="start"
          onClick={exerciseResistanceChange.enable}
          title={t("exercise.resistance.change.cta")}
          type="button"
          {...exerciseResistanceChange.props.controller}
        >
          {t(`exercise.resistance.${exercise.data.resistance}`)}
        </button>
      )}

      {exercise.actions.resistanceChange.available && exerciseResistanceChange.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...exerciseResistanceChange.props.target}
        >
          <ui.ExerciseResistancePicker disabled={mutation.isLoading} field={resistance} />

          <div data-stack="x" data-wrap="wrap" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={resistance.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel
              onClick={bg.exec([resistance.clear, mutation.reset, exerciseResistanceChange.disable])}
            />
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("exercise.resistance.change.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
