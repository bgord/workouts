import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { Form } from "../../app/services/exercise-category-add-form";
import * as ui from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exerciseCategories } = catalogRoute.useLoaderData();

  const name = bg.useTextField(Form.name.field);

  const mutation = bg.useMutation({
    perform: () =>
      fetch("/api/exercises/category", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async (_, context) => {
      await router.invalidate({ filter: (match) => match.routeId === catalogRoute.id, sync: true });
      bg.Fields.clearAll([name]);
      context.form?.reset();
    },
  });

  /* v8 ignore next */
  if (!exerciseCategories.actions.add.available) return null;

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <div data-stack="y" {...ui.Gap.field}>
        <label {...name.label.props}>{t("exercise.category.add.name.label")}</label>

        <div data-stack="x" {...ui.Gap.field}>
          <input
            className="c-input"
            data-grow="1"
            data-minw="0"
            maxLength={Form.name.pattern.max}
            minLength={Form.name.pattern.min}
            placeholder={t("exercise.category.add.name.placeholder")}
            required
            {...name.input.props}
          />

          <button
            className="c-button"
            data-variant="primary"
            disabled={name.empty || mutation.isLoading}
            type="submit"
          >
            <Plus data-size="sm" />
            {t("exercise.category.add.submit.cta")}
          </button>
        </div>
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("exercise.category.add.error")}
        </output>
      )}
    </form>
  );
}
