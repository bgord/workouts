import * as bg from "@bgord/ui";
import { Trash2 } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import type { ActionState } from "../../modules/action-state";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { Dialog, DialogError, DialogFooter, DialogHeader, DialogInfo } from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDelete(props: { exercise: ExerciseWithCategories; action: ActionState }) {
  const t = bg.useTranslations();
  const navigate = exerciseRoute.useNavigate();
  const dialog = bg.useToggle({ name: "exercise-delete" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${props.exercise.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      dialog.disable();

      await navigate({ search: Form.default, to: "/catalog" });
    },
  });

  return (
    <>
      <button
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-self="start"
        data-variant="ghost"
        disabled={!props.action.enabled}
        onClick={dialog.enable}
        title={t("exercise.delete.title", { name: props.exercise.name })}
        type="button"
        {...dialog.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <Dialog {...dialog}>
        <DialogHeader disabled={mutation.isLoading} onClose={dialog.disable}>
          {t("exercise.delete.header")}
        </DialogHeader>

        <DialogInfo variant="danger">{t("exercise.delete.info", { name: props.exercise.name })}</DialogInfo>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("exercise.delete.error")}</DialogError>}

          <DialogFooter onCancel={dialog.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("exercise.delete.cta")}
            </button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  );
}
