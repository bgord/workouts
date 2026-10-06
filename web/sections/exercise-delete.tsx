import * as bg from "@bgord/ui";
import { Trash2 } from "lucide-react";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDelete() {
  const t = bg.useTranslations();
  const navigate = exerciseRoute.useNavigate();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseDelete = bg.useToggle({ name: "exercise-delete" });

  const mutation = bg.useMutation({
    perform: () => fetch(`/api/exercises/${exercise.data.id}`, { method: "DELETE", credentials: "include" }),
    onSuccess: async () => {
      exerciseDelete.disable();
      await navigate({ to: "/catalog" });
    },
  });

  /* v8 ignore next */
  if (!exercise.actions.delete.available) return null;

  return (
    <>
      <bg.MenuItem
        aria-haspopup="dialog"
        disabled={!exercise.actions.delete.enabled}
        onClick={exerciseDelete.enable}
        tone="danger"
        {...ui.describedByHint(exercise.actions.delete, "exercise-delete-hint")}
      >
        <Trash2 data-size="sm" />
        {t("exercise.delete.cta")}
      </bg.MenuItem>

      <ui.ActionHint {...exercise.actions.delete} data-px="2-5" data-py="1-5" id="exercise-delete-hint" />

      <ui.Dialog {...exerciseDelete}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={exerciseDelete.disable}>
          {t("exercise.delete.header")}
        </ui.DialogHeader>

        <ui.DialogBody>
          <ui.DialogInfo>{t("exercise.delete.info", { name: exercise.data.name })}</ui.DialogInfo>
          <ui.DialogStatus variant="irreversible" />
        </ui.DialogBody>

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
    </>
  );
}
