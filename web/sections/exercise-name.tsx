import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import * as ui from "../components";
import { exerciseRoute } from "../router";

export function ExerciseName(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const { toggle } = bg.extractUseToggle(props);

  const name = bg.useTextField({ ...Form.name.field, defaultValue: exercise.data.name });

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/exercises/${exercise.data.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value, description: exercise.data.description }),
      }),
    onSuccess: async () => {
      toggle.disable();
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

  if (toggle.off) {
    return (
      <h1 aria-label={exercise.data.name} data-grow="1" data-minw="0">
        <button
          aria-label={t("exercise.update.name.cta", { name: exercise.data.name })}
          data-cursor="pointer"
          data-focus-ring-offset="inset"
          data-maxw="100%"
          data-transform="truncate"
          onClick={toggle.enable}
          title={t("exercise.update.name.cta", { name: exercise.data.name })}
          type="button"
          {...toggle.props.controller}
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
      {...toggle.props.target}
    >
      <div data-stack="x" {...ui.Gap.inline}>
        <input
          aria-label={t("exercise.update.name.label")}
          autoFocus
          className="c-input"
          data-grow="1"
          data-minw="0"
          maxLength={Form.name.pattern.max}
          minLength={Form.name.pattern.min}
          required
          {...name.input.props}
        />

        <ui.InlineEditActions
          disabled={name.unchanged || mutation.isLoading}
          onCancel={bg.exec([name.clear, mutation.reset, toggle.disable])}
        />
      </div>

      {mutation.isError && (
        <output aria-live="assertive" data-tone="danger">
          {t("exercise.update.error")}
        </output>
      )}
    </form>
  );
}
