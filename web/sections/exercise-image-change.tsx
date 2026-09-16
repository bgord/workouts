import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, FileImage, ImageUp, X } from "lucide-react";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ExerciseImage, ExerciseImageSize } from "../components";
import { exerciseRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const label = { minWidth: 0 };

export function ExerciseImageChange(props: { exercise: ExerciseWithCategories }) {
  const t = bg.useTranslations();
  const router = useRouter();
  const change = bg.useToggle({ name: "exercise-image-change" });

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

  return (
    <div data-gap="3" data-stack="y">
      <button
        data-cursor="pointer"
        data-disp="flex"
        onClick={change.enable}
        title={t("exercise.image.change.cta")}
        type="button"
        {...change.props.controller}
      >
        <ExerciseImage size={ExerciseImageSize.lg} {...props.exercise} />
      </button>

      {change.off && (
        <button
          className="c-button"
          data-fs="xs"
          data-self="center"
          data-variant="ghost"
          onClick={change.enable}
          type="button"
        >
          <ImageUp data-size="sm" />
          {t("exercise.image.change.cta")}
        </button>
      )}

      {change.on && (
        <form
          data-gap="2"
          data-stack="y"
          encType="multipart/form-data"
          onSubmit={mutation.handleSubmit}
          {...change.props.target}
        >
          <div data-cross="center" data-gap="1" data-stack="x" data-wrap="nowrap">
            <label
              className="c-button"
              data-cross="center"
              data-disp="flex"
              data-gap="2"
              data-grow="1"
              data-main="center"
              data-variant="secondary"
              data-wrap="nowrap"
              style={label}
              tabIndex={0}
              {...image.label.props}
            >
              {image.isSelected ? (
                <FileImage data-color="neutral-400" data-shrink="0" data-size="sm" />
              ) : (
                <ImageUp data-shrink="0" data-size="sm" />
              )}

              <span data-transform="truncate">
                {image.isSelected ? image.data.name : t("exercise.image.change.select.cta")}
              </span>

              <input
                className="c-visually-hidden"
                disabled={image.isSelected}
                onChange={image.actions.selectFile}
                required
                type="file"
                {...image.input.props}
              />
            </label>

            <button
              aria-label={t("app.save")}
              className="c-button"
              data-color="positive-400"
              data-hover-color="positive-200"
              data-px="0"
              data-variant="ghost"
              disabled={!image.isSelected || mutation.isLoading}
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
              data-variant="ghost"
              onClick={bg.exec([image.actions.clearFile, mutation.reset, change.disable])}
              title={t("app.cancel")}
              type="button"
              {...bg.Rhythm().times(3).style.width}
            >
              <X data-size="sm" />
            </button>
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("exercise.image.change.hint")}
          </div>

          {mutation.isError && (
            <output data-color="danger-400" data-fs="xs">
              {t("exercise.image.change.error")}
            </output>
          )}
        </form>
      )}
    </div>
  );
}
