import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo, DialogStatus } from "../components";
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
        data-shrink="0"
        data-variant="icon"
        onClick={dialog.enable}
        title={t("exercise.category.delete.title", { name: props.name })}
        type="button"
        {...dialog.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <Dialog {...dialog}>
        <DialogHeader disabled={mutation.isLoading} onClose={dialog.disable}>
          {t("exercise.category.delete.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>{t("exercise.category.delete.info", { name: props.name })}</DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("exercise.category.delete.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={dialog.disable}>
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
