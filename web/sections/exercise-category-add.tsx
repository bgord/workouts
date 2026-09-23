import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
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
      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
      bg.Fields.clearAll([name]);
      context.form?.reset();
    },
  });

  if (!exerciseCategories.actions.add.available) return null;

  return (
    <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Gap.cluster}>
      <div data-cross="center" data-stack="x" {...ui.Gap.inline}>
        <label className="c-visually-hidden" {...name.label.props}>
          {t("exercise.category.add.name.label")}
        </label>

        <input
          className="c-input"
          data-grow="1"
          data-minw="0"
          placeholder={t("exercise.category.add.name.placeholder")}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <ui.IconButton
          aria-label={t("exercise.category.add.submit.cta")}
          disabled={name.empty || mutation.isLoading}
          title={t("exercise.category.add.submit.cta")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>

        <ui.IconButton
          aria-label={t("app.clear")}
          disabled={name.unchanged}
          onClick={bg.exec([name.clear, mutation.reset])}
          title={t("app.clear")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      {mutation.isError && <ui.Output>{t("exercise.category.add.error")}</ui.Output>}
    </form>
  );
}
