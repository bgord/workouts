import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, X } from "lucide-react";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { IconButton, Output } from "../components";
import { exerciseRoute } from "../router";

export function ExerciseNameUpdate(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const exerciseNameUpdate = bg.useToggle({ name: "exercise-name-update" });

  const name = bg.useTextField({ ...Form.name.field, defaultValue: props.exercise.name });

  const mutation = bg.useMutation({
    perform: async () =>
      fetch(`/api/exercises/${props.exercise.id}`, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ name: name.value, description: props.exercise.description }),
      }),
    onSuccess: async () => {
      exerciseNameUpdate.disable();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (exerciseNameUpdate.off) {
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
          onClick={exerciseNameUpdate.enable}
          title={t("exercise.update.name.cta")}
          type="button"
          {...exerciseNameUpdate.props.controller}
        >
          {props.exercise.name}
        </button>
      </h1>
    );
  }

  return (
    <form
      data-gap="2"
      data-grow="1"
      data-stack="y"
      onSubmit={mutation.handleSubmit}
      {...bg.Rhythm().times(0).style.minWidth}
      {...exerciseNameUpdate.props.target}
    >
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

        <IconButton
          aria-label={t("app.save")}
          disabled={name.unchanged || mutation.isLoading}
          title={t("app.save")}
          tone="positive"
          type="submit"
        >
          <Check data-size="sm" />
        </IconButton>

        <IconButton
          aria-label={t("app.cancel")}
          onClick={bg.exec([name.clear, mutation.reset, exerciseNameUpdate.disable])}
          title={t("app.cancel")}
        >
          <X data-size="sm" />
        </IconButton>
      </div>

      {mutation.isError && <Output>{t("exercise.update.error")}</Output>}
    </form>
  );
}
