import * as bg from "@bgord/ui";
import { Trash2 } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import type { ActionState } from "../../modules/action-state";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import {
  Dialog,
  DialogError,
  DialogFooter,
  DialogHeader,
  DialogInfo,
  DialogStatus,
  IconButton,
} from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDelete(props: { exercise: ExerciseWithCategories; action: ActionState }) {
  const t = bg.useTranslations();
  const navigate = exerciseRoute.useNavigate();

  const exerciseDelete = bg.useToggle({ name: "exercise-delete" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${props.exercise.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      exerciseDelete.disable();

      await navigate({ search: Form.default, to: "/catalog" });
    },
  });

  return (
    <>
      <IconButton
        data-self="start"
        disabled={!props.action.enabled}
        onClick={exerciseDelete.enable}
        title={t("exercise.delete.title", { name: props.exercise.name })}
        tone="danger"
        {...exerciseDelete.props.controller}
      >
        <Trash2 data-size="sm" />
      </IconButton>

      <Dialog {...exerciseDelete}>
        <DialogHeader disabled={mutation.isLoading} onClose={exerciseDelete.disable}>
          {t("exercise.delete.header")}
        </DialogHeader>

        <div data-gap="3" data-stack="y">
          <DialogInfo>{t("exercise.delete.info", { name: props.exercise.name })}</DialogInfo>
          <DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && <DialogError>{t("exercise.delete.error")}</DialogError>}

          <DialogFooter disabled={mutation.isLoading} onCancel={exerciseDelete.disable}>
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
