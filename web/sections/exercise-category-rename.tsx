import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil, X } from "lucide-react";
import { Form } from "../../app/services/exercise-category-add-form";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { IconButton } from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryRename(props: ExerciseCategory & bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.name });

  const mutation = bg.useMutation({
    perform: async () =>
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

  if (toggle.off) {
    return (
      <button
        data-color="neutral-100"
        data-cross="center"
        data-cursor="pointer"
        data-fs="sm"
        data-gap="3"
        data-grow="1"
        data-hover-color="neutral-200"
        data-main="between"
        data-stack="x"
        data-wrap="nowrap"
        onClick={toggle.enable}
        title={t("exercise.category.rename.cta")}
        type="button"
        {...toggle.props.controller}
      >
        <span data-transform="truncate">{props.name}</span>
        <Pencil data-color="neutral-500" data-shrink="0" data-size="xs" />
      </button>
    );
  }

  return (
    <form
      data-gap="2"
      data-grow="1"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...bg.Rhythm().times(0).style.minWidth}
      {...toggle.props.target}
    >
      <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
        <input
          aria-label={t("exercise.category.rename.label")}
          className="c-input"
          data-grow="1"
          {...bg.Rhythm().times(0).style.minWidth}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <IconButton
          aria-label={t("app.save")}
          disabled={name.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </IconButton>

        <IconButton
          aria-label={t("app.cancel")}
          onClick={bg.exec([name.clear, mutation.reset, toggle.disable])}
          title={t("app.cancel")}
        >
          <X data-size="sm" />
        </IconButton>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs">
          {t("exercise.category.rename.error")}
        </output>
      )}
    </form>
  );
}
