import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ButtonCancel } from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDescriptionUpdate(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const update = bg.useToggle({ name: "exercise-description-update" });

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
      update.disable();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (update.off) {
    return (
      <button
        className="c-prose"
        data-color="neutral-200"
        data-cursor="pointer"
        data-self="start"
        data-ta="start"
        onClick={update.enable}
        title={t("exercise.update.description.cta")}
        type="button"
        {...update.props.controller}
      >
        {props.exercise.description}
      </button>
    );
  }

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit} {...update.props.target}>
      <textarea
        aria-label={t("exercise.update.description.label")}
        className="c-textarea"
        rows={3}
        {...bg.Form.textarea(Form.description.pattern)}
        {...description.input.props}
      />

      <div data-cross="center" data-gap="3" data-stack="x">
        <button
          className="c-button"
          data-variant="secondary"
          disabled={description.unchanged || mutation.isLoading}
          type="submit"
        >
          {t("app.save")}
        </button>

        <ButtonCancel onClick={bg.exec([description.clear, mutation.reset, update.disable])} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.update.error")}
        </output>
      )}
    </form>
  );
}
