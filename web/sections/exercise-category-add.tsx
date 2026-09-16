import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/exercise-category-add-form";
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
      <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
        <label className="c-visually-hidden" {...name.label.props}>
          {t("exercise.category.add.name.label")}
        </label>

        <input
          className="c-input"
          data-grow="1"
          data-variant="transparent"
          placeholder={t("exercise.category.add.name.placeholder")}
          style={{ ...bg.Rhythm().times(0).minWidth }}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <button
          aria-label={t("exercise.category.add.submit.cta")}
          className="c-button"
          data-color="positive-400"
          data-hover-color="positive-200"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={name.unchanged || mutation.isLoading}
          title={t("exercise.category.add.submit.cta")}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
        >
          <Check data-size="sm" />
        </button>

        <button
          aria-label={t("app.clear")}
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={name.unchanged}
          onClick={bg.exec([name.clear, mutation.reset])}
          title={t("app.clear")}
          type="button"
          {...bg.Rhythm().times(3).style.width}
        >
          <X data-size="sm" />
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs">
          {t("exercise.category.add.error")}
        </output>
      )}
    </form>
  );
}
