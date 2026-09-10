import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ButtonCancel, ExerciseImage, ExerciseImageSize } from "../components";
import { exerciseRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];

export function ExerciseImageChange(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const change = bg.useToggle({ name: "exercise-image-change" });
  const { exerciseImageEtag } = exerciseRoute.useLoaderData();

  const image = bg.useFile("exercise-image-change-file", { mimeTypes, maxSizeBytes: 10_000_000 });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      if (image.data) form.append("file", image.data);

      return fetch(`/api/exercises/${props.exercise.id}/image`, {
        method: "PATCH",
        body: form,
        credentials: "include",
      });
    },
    onSuccess: async () => {
      change.disable();
      image.actions.clearFile();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (change.off) {
    return (
      <button
        data-cursor="pointer"
        data-self="start"
        onClick={change.enable}
        title={t("exercise.image.change.cta")}
        type="button"
        {...change.props.controller}
      >
        <ExerciseImage etag={exerciseImageEtag} exercise={props.exercise} size={ExerciseImageSize.lg} />
      </button>
    );
  }

  return (
    <div data-gap="3" data-stack="y" {...change.props.target}>
      <ExerciseImage etag={exerciseImageEtag} exercise={props.exercise} size={ExerciseImageSize.lg} />

      <form data-gap="2" data-stack="y" encType="multipart/form-data" onSubmit={mutation.handleSubmit}>
        <div data-cross="center" data-gap="3" data-stack="x">
          <label
            className="c-button"
            data-cross="center"
            data-disp="flex"
            data-main="center"
            data-variant="secondary"
            {...image.label.props}
          >
            <span>{t("exercise.image.change.select.cta")}</span>
            <input
              className="c-visually-hidden"
              disabled={image.isSelected}
              onChange={image.actions.selectFile}
              required
              type="file"
              {...image.input.props}
            />
          </label>

          {image.isSelected && (
            <output data-color="neutral-300" data-fs="xs">
              {t("exercise.image.change.selected", { name: image.data.name })}
            </output>
          )}

          <button
            className="c-button"
            data-variant="secondary"
            disabled={!image.isSelected || mutation.isLoading}
            type="submit"
          >
            {t("app.save")}
          </button>

          <ButtonCancel onClick={bg.exec([image.actions.clearFile, mutation.reset, change.disable])} />
        </div>

        <div data-color="neutral-400" data-fs="xs">
          {t("exercise.image.change.hint")}
        </div>

        {mutation.isError && (
          <output data-color="danger-400" data-fs="sm">
            {t("exercise.image.change.error")}
          </output>
        )}
      </form>
    </div>
  );
}
