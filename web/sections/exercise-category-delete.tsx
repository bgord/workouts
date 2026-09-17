import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import * as ui from "../components";
import { catalogRoute } from "../router";

export function ExerciseCategoryDelete(props: ExerciseCategory) {
  const t = bg.useTranslations();
  const router = useRouter();

  const exerciseCategoryDelete = bg.useToggle({ name: `exercise-category-delete-${props.id}` });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/category/${props.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      exerciseCategoryDelete.disable();

      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
    },
  });

  return (
    <>
      <ui.IconButton
        onClick={exerciseCategoryDelete.enable}
        title={t("exercise.category.delete.title", { name: props.name })}
        tone="danger"
        {...exerciseCategoryDelete.props.controller}
      >
        <Trash2 data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...exerciseCategoryDelete}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={exerciseCategoryDelete.disable}>
          {t("exercise.category.delete.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Spacing.content}>
          <ui.DialogInfo>{t("exercise.category.delete.info", { name: props.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Spacing.dialogStack}>
          {mutation.isError && <ui.DialogError>{t("exercise.category.delete.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={exerciseCategoryDelete.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("exercise.category.delete.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
