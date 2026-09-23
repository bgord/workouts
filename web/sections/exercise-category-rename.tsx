import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
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
      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
    },
  });

  if (!exerciseCategories.actions.rename.available) return <div data-fs="sm">{props.name}</div>;

  if (toggle.off) {
    return (
      <button
        data-color="neutral-100"
        data-cursor="pointer"
        data-fs="sm"
        data-hover-color="brand-300"
        data-transform="truncate"
        disabled={!exerciseCategories.actions.rename.enabled}
        onClick={toggle.enable}
        title={t("exercise.category.rename.cta")}
        type="button"
        {...toggle.props.controller}
      >
        {props.name}
      </button>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-grow="1"
      data-minw="0"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...toggle.props.target}
    >
      <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
        <input
          aria-label={t("exercise.category.rename.label")}
          className="c-input"
          data-grow="1"
          data-minw="0"
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <ui.IconButton
          aria-label={t("app.save")}
          disabled={!exerciseCategories.actions.rename.enabled || name.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>

        <ui.IconButton
          aria-label={t("app.cancel")}
          onClick={bg.exec([name.clear, mutation.reset, toggle.disable])}
          title={t("app.cancel")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      {mutation.isError && <ui.Output>{t("exercise.category.rename.error")}</ui.Output>}
    </form>
  );
}
