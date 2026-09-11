import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/exercise-category-add-form";
import { ButtonClear } from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryAdd() {
  const t = bg.useTranslations();
  const router = useRouter();

  const name = bg.useTextField(Form.name.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async (_, context) => {
      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
      bg.Fields.clearAll([name]);
      context.form?.reset();
    },
  });

  return (
    <form data-gap="2" data-stack="y" onSubmit={mutation.handleSubmit}>
      <div data-cross="center" data-gap="2" data-stack="x">
        <label className="c-visually-hidden" {...name.label.props}>
          {t("exercise.category.add.name.label")}
        </label>

        <input
          className="c-input"
          data-grow="1"
          placeholder={t("exercise.category.add.name.placeholder")}
          style={{ background: "transparent" }}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        {name.changed && <ButtonClear onClick={bg.exec([name.clear, mutation.reset])} />}

        <button
          className="c-button"
          data-md-grow="1"
          data-variant="secondary"
          disabled={mutation.isLoading || !name.changed}
          type="submit"
        >
          <Plus data-size="sm" />
          {t("exercise.category.add.submit.cta")}
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.category.add.error")}
        </output>
      )}
    </form>
  );
}
