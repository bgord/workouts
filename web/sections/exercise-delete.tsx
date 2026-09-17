import * as bg from "@bgord/ui";
import { Trash2 } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDelete() {
  const t = bg.useTranslations();
  const navigate = exerciseRoute.useNavigate();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseDelete = bg.useToggle({ name: "exercise-delete" });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${exercise.data.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      exerciseDelete.disable();

      await navigate({ search: Form.default, to: "/catalog" });
    },
  });

  if (!exercise.actions.delete.available) return null;

  return (
    <div data-cross="center" data-shrink="0" data-stack="x" data-wrap="nowrap" {...ui.Gap.cluster}>
      <div data-md-disp="none">
        <ui.ActionHint {...exercise.actions.delete} />
      </div>

      <ui.IconButton
        data-self="start"
        disabled={!exercise.actions.delete.enabled}
        onClick={exerciseDelete.enable}
        title={t("exercise.delete.title", { name: exercise.data.name })}
        tone="danger"
        {...exerciseDelete.props.controller}
      >
        <Trash2 data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...exerciseDelete}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={exerciseDelete.disable}>
          {t("exercise.delete.header")}
        </ui.DialogHeader>

        <div data-stack="y" {...ui.Gap.related}>
          <ui.DialogInfo>{t("exercise.delete.info", { name: exercise.data.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </div>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
        >
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
    </div>
  );
}
