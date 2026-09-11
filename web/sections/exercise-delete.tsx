import * as bg from "@bgord/ui";
import { CircleAlert, Trash2 } from "lucide-react";
import { Form } from "../../app/services/exercise-catalog-filters-form";
import type { ActionState } from "../../modules/action-state";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ActionHint, ButtonCancel, ButtonClose } from "../components";
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
      <ActionHint action={props.action} />

      <button
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-variant="ghost"
        disabled={!props.action.enabled}
        onClick={dialog.enable}
        title={t("exercise.delete.title", { name: props.exercise.name })}
        type="button"
        {...dialog.props.controller}
      >
        <Trash2 data-size="sm" />
      </button>

      <bg.Dialog data-gap="8" data-mt="12" {...bg.Rhythm().times(50).style.width} {...dialog}>
        <div data-cross="center" data-main="between" data-stack="x">
          <strong data-color="neutral-100">{t("exercise.delete.header")}</strong>
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
          {t("exercise.delete.info", { name: props.exercise.name })}
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          {mutation.isError && (
            <output aria-live="assertive" data-color="danger-400" data-fs="sm">
              {t("exercise.delete.error")}
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
              {t("exercise.delete.cta")}
            </button>
          </div>
        </form>
      </bg.Dialog>
    </>
  );
}
