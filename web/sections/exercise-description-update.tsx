import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDescriptionUpdate(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const exerciseDescriptionUpdate = bg.useToggle({ name: "exercise-description-update" });

  const description = bg.useTextField({
    ...Form.description.field,
    defaultValue: props.exercise.description,
  });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${props.exercise.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: props.exercise.name, description: description.value }),
      }),
    onSuccess: async () => {
      exerciseDescriptionUpdate.disable();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (exerciseDescriptionUpdate.off) {
    return (
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
        {props.exercise.description}
      </button>
    );
  }

  return (
    <form
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Spacing.cluster}
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

      <div data-cross="center" data-stack="x" {...ui.Spacing.inline}>
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
  );
}
