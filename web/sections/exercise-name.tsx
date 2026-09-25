import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/exercise-add-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseName() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseNameUpdate = bg.useToggle({ name: "exercise-name-update" });

  const name = bg.useTextField({ ...Form.name.field, defaultValue: exercise.data.name });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value, description: exercise.data.description }),
      }),
    onSuccess: async () => {
      exerciseNameUpdate.disable();
      await router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });
    },
  });

  if (!exercise.actions.update.available) {
    return (
      <h1 data-grow="1" data-minw="0">
        {exercise.data.name}
      </h1>
    );
  }

  if (exerciseNameUpdate.off) {
    return (
      <h1 data-grow="1" data-minw="0">
        <button
          data-cursor="pointer"
          data-maxw="100%"
          data-transform="truncate"
          onClick={exerciseNameUpdate.enable}
          title={t("exercise.update.name.cta")}
          type="button"
          {...exerciseNameUpdate.props.controller}
        >
          {exercise.data.name}
        </button>
      </h1>
    );
  }

  return (
    <form
      aria-busy={mutation.isLoading}
      data-grow="1"
      data-minw="0"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...ui.Gap.cluster}
      {...exerciseNameUpdate.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("exercise.update.name.label")}
          className="c-input"
          data-grow="1"
          data-minw="0"
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <ui.IconButton
          aria-label={t("app.save")}
          disabled={name.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </ui.IconButton>

        <ui.IconButton
          aria-label={t("app.cancel")}
          onClick={bg.exec([name.clear, mutation.reset, exerciseNameUpdate.disable])}
          title={t("app.cancel")}
        >
          <X data-size="sm" />
        </ui.IconButton>
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("exercise.update.error")}
        </output>
      )}
    </form>
  );
}
