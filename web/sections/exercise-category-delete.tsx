import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import {
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  DialogInfo,
  DialogStatus,
  IconButton,
} from "../components";
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
      <IconButton
        onClick={exerciseCategoryDelete.enable}
        title={t("exercise.category.delete.title", { name: props.name })}
        tone="danger"
        {...exerciseCategoryDelete.props.controller}
      >
        <Trash2 data-size="sm" />
      </IconButton>

      <Dialog {...exerciseCategoryDelete}>
        <DialogHeader disabled={mutation.isLoading} onClose={exerciseCategoryDelete.disable}>
          {t("exercise.category.delete.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>{t("exercise.category.delete.info", { name: props.name })}</DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("exercise.category.delete.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={exerciseCategoryDelete.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("exercise.category.delete.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
