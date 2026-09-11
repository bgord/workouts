import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ButtonCancel } from "../components";
import { exerciseRoute } from "../router";

export function ExerciseNameUpdate(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const update = bg.useToggle({ name: "exercise-name-update" });

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.exercise.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${props.exercise.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value, description: props.exercise.description }),
      }),
    onSuccess: async () => {
      update.disable();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (update.off) {
    return (
      <h1 data-grow="1" data-maxw="100%" data-transform="truncate">
        <button
          data-color="neutral-0"
          data-cursor="pointer"
          data-fs="2xl"
          data-fw="black"
          data-maxw="100%"
          data-md-fs="xl"
          data-transform="truncate"
          onClick={update.enable}
          title={t("exercise.update.name.cta")}
          type="button"
          {...update.props.controller}
        >
          {props.exercise.name}
        </button>
      </h1>
    );
  }

  return (
    <form data-gap="2" data-grow="1" data-stack="y" onSubmit={mutation.handleSubmit} {...update.props.target}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          aria-label={t("exercise.update.name.label")}
          className="c-input"
          data-md-width="100%"
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <div data-cross="center" data-gap="1" data-md-width="100%" data-stack="x">
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="secondary"
            disabled={name.unchanged || mutation.isLoading}
            type="submit"
          >
            {t("app.save")}
          </button>

          <ButtonCancel data-md-grow="1" onClick={bg.exec([name.clear, mutation.reset, update.disable])} />
        </div>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.update.error")}
        </output>
      )}
    </form>
  );
}
