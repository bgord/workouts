import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { Form } from "../../app/services/exercise-category-add-form";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import * as ui from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryRename(props: ExerciseCategory & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exerciseCategories } = catalogRoute.useLoaderData();
  const { toggle } = bg.extractUseToggle(props);

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.name });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/category/${props.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value }),
      }),
    onSuccess: async () => {
      toggle.disable();
      await router.invalidate({ filter: (match) => match.routeId === catalogRoute.id, sync: true });
    },
  });

  /* v8 ignore next */
  if (!exerciseCategories.actions.rename.available) return null;

  if (toggle.off) {
    return (
      <ui.IconButton
        aria-label={t("exercise.category.rename.cta", { name: props.name })}
        disabled={!exerciseCategories.actions.rename.enabled}
        onClick={toggle.enable}
        title={t("exercise.category.rename.cta", { name: props.name })}
        {...toggle.props.controller}
      >
        <Pencil data-size="sm" />
      </ui.IconButton>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      aria-label={t("exercise.category.rename.cta", { name: props.name })}
      data-grow="1"
      data-minw="0"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("exercise.category.rename.label")}
          autoFocus
          className="c-input"
          data-grow="1"
          data-minw="0"
          maxLength={Form.name.pattern.max}
          minLength={Form.name.pattern.min}
          required
          {...name.input.props}
        />

        <ui.InlineEditActions
          disabled={name.unchanged || mutation.isLoading}
          onCancel={bg.exec([name.clear, mutation.reset, toggle.disable])}
        />
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("exercise.category.rename.error")}
        </output>
      )}
    </form>
  );
}
