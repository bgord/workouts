import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDescription() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseDescriptionUpdate = bg.useToggle({ name: "exercise-description-update" });

  const description = bg.useTextField({
    ...Form.description.field,
    defaultValue: exercise.data.description,
  });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: exercise.data.name, description: description.value }),
      }),
    onSuccess: async () => {
      exerciseDescriptionUpdate.disable();
      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <ui.Eyebrow>{t("exercise.add.description.label")}</ui.Eyebrow>

      {!exercise.actions.update.enabled && (
        <p className="c-prose" data-color="neutral-200">
          {exercise.data.description}
        </p>
      )}

      {exercise.actions.update.enabled && exerciseDescriptionUpdate.off && (
        <button
          className="c-prose"
          data-color="neutral-200"
          data-cursor="pointer"
          data-fs="sm"
          data-self="start"
          data-ta="start"
          onClick={exerciseDescriptionUpdate.enable}
          title={t("exercise.update.description.cta")}
          type="button"
          {...exerciseDescriptionUpdate.props.controller}
        >
          {exercise.data.description}
        </button>
      )}

      {exercise.actions.update.enabled && exerciseDescriptionUpdate.on && (
        <form
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...exerciseDescriptionUpdate.props.target}
        >
          <textarea
            aria-label={t("exercise.update.description.label")}
            className="c-textarea"
            data-variant="transparent"
            rows={3}
            {...bg.Form.textarea(Form.description.pattern)}
            {...description.input.props}
          />

          <div data-cross="center" data-stack="x" {...ui.Gap.inline}>
            <button
              className="c-button"
              data-variant="secondary"
              disabled={description.unchanged || mutation.isLoading}
              type="submit"
            >
              {t("app.save")}
            </button>

            <ui.ButtonCancel
              onClick={bg.exec([description.clear, mutation.reset, exerciseDescriptionUpdate.disable])}
            />
          </div>

          {mutation.isError && <ui.Output>{t("exercise.update.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
