import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { CircleAlert, Trash2 } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { ButtonCancel, ButtonClose } from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryDelete(props: ExerciseCategory) {
  const t = bg.useTranslations();
  const router = useRouter();
  const dialog = bg.useToggle({ name: `exercise-category-delete-${props.id}` });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/category/${props.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      dialog.disable();

      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
    },
  });

  return (
    <>
      <button
        className="c-button"
        data-color="neutral-500"
        data-hover-color="danger-400"
        data-variant="icon"
        onClick={dialog.enable}
        title={t("exercise.category.delete.title", { name: props.name })}
        type="button"
        {...dialog.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...dialog}>
        <div data-cross="center" data-main="between" data-stack="x">
          <strong data-color="neutral-100">{t("exercise.category.delete.header")}</strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <div
          data-color="danger-400"
          data-cross="center"
          data-fs="sm"
          data-gap="2"
          data-lh="loose"
          data-stack="x"
        >
          <CircleAlert data-size="md" />
          {t("exercise.category.delete.info", { name: props.name })}
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && (
            <output aria-live="assertive" data-color="danger-400" data-fs="sm">
              {t("exercise.category.delete.error")}
            </output>
          )}

          <div data-gap="5" data-main="end" data-stack="x">
            <ButtonCancel onClick={dialog.disable} />

            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("exercise.category.delete.cta")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
