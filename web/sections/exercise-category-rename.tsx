import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, Pencil, X } from "lucide-react";
import { Form } from "../../app/services/exercise-category-add-form";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { catalogRoute } from "../router";

export function ExerciseCategoryRename(props: ExerciseCategory & { toggle: bg.UseToggleReturnType }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const rename = props.toggle;

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
        onClick={rename.enable}
        title={t("exercise.category.rename.cta")}
        type="button"
        {...rename.props.controller}
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
      {...rename.props.target}
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

        <button
          aria-label={t("app.save")}
          className="c-button"
          data-color="positive-400"
          data-hover-color="positive-200"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={name.unchanged || mutation.isLoading}
          title={t("app.save")}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
        >
          <Check data-size="sm" />
        </button>

        <button
          aria-label={t("app.cancel")}
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          onClick={bg.exec([name.clear, mutation.reset, rename.disable])}
          title={t("app.cancel")}
          type="button"
          {...bg.Rhythm().times(3).style.width}
        >
          <X data-size="sm" />
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs">
          {t("exercise.category.rename.error")}
        </output>
      )}
    </form>
  );
}
