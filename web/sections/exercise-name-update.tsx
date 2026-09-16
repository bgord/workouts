import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { exerciseRoute } from "../router";

export function ExerciseNameUpdate(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const update = bg.useToggle({ name: "exercise-name-update" });

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.exercise.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${props.exercise.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value, description: props.exercise.description }),
      }),
    onSuccess: async () => {
      update.disable();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (update.off) {
    return (
      <h1 data-fs="2xl" data-grow="1" data-maxw="100%" data-md-fs="xl" data-transform="truncate">
        <button
          data-color="neutral-0"
          data-cursor="pointer"
          data-fs="2xl"
          data-fw="black"
          data-maxw="100%"
          data-md-fs="xl"
          data-transform="truncate"
          onClick={update.enable}
          title={t("exercise.update.name.cta")}
          type="button"
          {...update.props.controller}
        >
          {props.exercise.name}
        </button>
      </h1>
    );
  }

  return (
    <form data-gap="2" data-grow="1" data-stack="y" onSubmit={mutation.handleSubmit} {...update.props.target}>
      <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
        <input
          aria-label={t("exercise.update.name.label")}
          className="c-input"
          data-grow="1"
          data-variant="transparent"
          {...bg.Rhythm().times(0).style.minWidth}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />

        <button
          aria-label={t("app.save")}
          className="c-button"
          data-color="positive-400"
          data-hover-color="positive-200"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          disabled={name.unchanged || mutation.isLoading}
          title={t("app.save")}
          type="submit"
          {...bg.Rhythm().times(3).style.width}
        >
          <Check data-size="sm" />
        </button>

        <button
          aria-label={t("app.cancel")}
          className="c-button"
          data-color="neutral-400"
          data-hover-color="neutral-0"
          data-px="0"
          data-shrink="0"
          data-variant="ghost"
          onClick={bg.exec([name.clear, mutation.reset, update.disable])}
          title={t("app.cancel")}
          type="button"
          {...bg.Rhythm().times(3).style.width}
        >
          <X data-size="sm" />
        </button>
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="xs">
          {t("exercise.update.error")}
        </output>
      )}
    </form>
  );
}
