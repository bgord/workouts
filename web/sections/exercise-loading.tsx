import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseLoadingOptions } from "../../modules/exercises/value-objects/exercise-loading-options";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseLoading() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseLoadingChange = bg.useToggle({ name: "exercise-loading-change" });

  const loading = bg.useTextField<ExerciseLoadingOptions>({
    ...Form.loading.field,
    defaultValue: exercise.data.loading,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}/loading`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ loading: loading.value }),
      }),
    onSuccess: async () => {
      exerciseLoadingChange.disable();
      await router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });
    },
  });

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("exercise.loading.label")}</h3>

      {!exercise.actions.loadingChange.available && <p>{t(`exercise.loading.${exercise.data.loading}`)}</p>}

      {exercise.actions.loadingChange.available && exerciseLoadingChange.off && (
        <button
          data-cursor="pointer"
          data-self="start"
          data-ta="start"
          onClick={exerciseLoadingChange.enable}
          title={t("exercise.loading.change.cta")}
          type="button"
          {...exerciseLoadingChange.props.controller}
        >
          {t(`exercise.loading.${exercise.data.loading}`)}
        </button>
      )}

      {exercise.actions.loadingChange.available && exerciseLoadingChange.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...exerciseLoadingChange.props.target}
        >
          <ui.ExerciseLoadingPicker disabled={mutation.isLoading} field={loading} />

          <div data-stack="x" data-wrap="wrap" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={loading.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel
              onClick={bg.exec([loading.clear, mutation.reset, exerciseLoadingChange.disable])}
            />
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("exercise.loading.change.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
