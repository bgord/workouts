import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-category-add-form";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { ButtonCancel } from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryRename(props: ExerciseCategory) {
  const t = bg.useTranslations();
  const router = useRouter();
  const rename = bg.useToggle({ name: `exercise-category-rename-${props.id}` });

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/category/${props.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async () => {
      rename.disable();

      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
    },
  });

  if (rename.off) {
    return (
      <button
        data-color="neutral-0"
        data-cursor="pointer"
        data-grow="1"
        data-self="start"
        onClick={rename.enable}
        title={t("exercise.category.rename.cta")}
        type="button"
        {...rename.props.controller}
      >
        {props.name}
      </button>
    );
  }

  return (
    <form data-gap="2" data-grow="1" data-stack="y" onSubmit={mutation.handleSubmit} {...rename.props.target}>
      <div data-cross="center" data-gap="3" data-stack="x">
        <input
          aria-label={t("exercise.category.rename.label")}
          className="c-input"
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <button className="c-button" data-variant="secondary" disabled={mutation.isLoading} type="submit">
          {t("app.save")}
        </button>

        <ButtonCancel onClick={bg.exec([name.clear, mutation.reset, rename.disable])} />
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.category.rename.error")}
        </output>
      )}
    </form>
  );
}
