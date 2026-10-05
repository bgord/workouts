import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseDescription() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseDescriptionUpdate = bg.useToggle({ name: "exercise-description-update" });

  const description = bg.useTextField({
    ...Form.description.field,
    defaultValue: exercise.data.description,
  });

  const metaEnterSubmit = bg.useMetaEnterSubmit();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: exercise.data.name, description: description.value }),
      }),
    onSuccess: async () => {
      exerciseDescriptionUpdate.disable();
      await router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });
    },
  });

  return (
    <div data-stack="y" {...ui.Gap.cluster}>
      <h3>{t("exercise.add.description.label")}</h3>

      {!exercise.actions.update.available && <p className="c-prose">{exercise.data.description}</p>}

      {exercise.actions.update.available && exerciseDescriptionUpdate.off && (
        <ui.TextareaTrigger
          onClick={exerciseDescriptionUpdate.enable}
          title={t("exercise.update.description.cta")}
          {...exerciseDescriptionUpdate.props.controller}
        >
          {exercise.data.description}
        </ui.TextareaTrigger>
      )}

      {exercise.actions.update.available && exerciseDescriptionUpdate.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...exerciseDescriptionUpdate.props.target}
        >
          <div data-cross="start" data-md-cross="stretch" data-md-stack="y" data-stack="x" {...ui.Gap.inline}>
            <textarea
              aria-label={t("exercise.update.description.label")}
              autoFocus
              className="c-textarea"
              data-grow="1"
              data-minw="0"
              style={{ fieldSizing: "content" }}
              {...bg.Form.textarea(Form.description.pattern)}
              {...description.input.props}
              {...metaEnterSubmit}
            />

            <ui.InlineEditActions
              data-md-self="end"
              disabled={description.unchanged || mutation.isLoading}
              onCancel={bg.exec([description.clear, mutation.reset, exerciseDescriptionUpdate.disable])}
            />
          </div>

          {mutation.isError && (
            <output aria-live="assertive" data-tone="danger">
              {t("exercise.update.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
