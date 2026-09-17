import * as bg from "@bgord/ui";
import { Trash2 } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import type { ActionState } from "../../modules/action-state";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import * as ui from "../components";
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
      <ui.IconButton
        data-self="start"
        disabled={!props.action.enabled}
        onClick={exerciseDelete.enable}
        title={t("exercise.delete.title", { name: props.exercise.name })}
        tone="danger"
        {...exerciseDelete.props.controller}
      >
        <Trash2 data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...exerciseDelete}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={exerciseDelete.disable}>
          {t("exercise.delete.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Spacing.related}>
          <ui.DialogInfo>{t("exercise.delete.info", { name: props.exercise.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form aria-busy={mutation.isLoading} data-stack="y" onSubmit={mutation.handleSubmit} {...ui.Spacing.stack}>
          {mutation.isError && <ui.DialogError>{t("exercise.delete.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={exerciseDelete.disable}>
            <button
              className="c-button"
              data-variant="destructive"
              disabled={mutation.isLoading}
              type="submit"
            >
              {t("exercise.delete.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
