import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, FileImage, ImageUp, X } from "lucide-react";
import * as ui from "../components";
import { exerciseRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const label = { minWidth: 0 };

export function ExerciseImageChange() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseImageChange = bg.useToggle({ name: "exercise-image-change" });

  const image = bg.useFile("exercise-image-change-file", { mimeTypes, maxSizeBytes: 10_000_000 });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      if (image.data) form.append("file", image.data);

      return fetch(`/api/exercises/${exercise.data.id}/image`, {
        method: "PATCH",
        body: form,
        credentials: "include",
      });
    },
    onSuccess: async () => {
      exerciseImageChange.disable();
      image.actions.clearFile();

      await router.invalidate({ filter: (route) => route.id === exerciseRoute.id, sync: true });
    },
  });

  if (!exercise.actions.imageChange.enabled) {
    return <ui.ExerciseImage size={ui.ExerciseImageSize.lg} {...exercise.data} />;
  }

  return (
    <div data-stack="y" {...ui.Gap.related}>
      <button
        data-cursor="pointer"
        data-disp="flex"
        onClick={exerciseImageChange.enable}
        title={t("exercise.image.change.cta")}
        type="button"
        {...exerciseImageChange.props.controller}
      >
        <ui.ExerciseImage size={ui.ExerciseImageSize.lg} {...exercise.data} />
      </button>

      {exerciseImageChange.off && (
        <button
          className="c-button"
          data-fs="xs"
          data-self="center"
          data-variant="ghost"
          onClick={exerciseImageChange.enable}
          type="button"
        >
          <ImageUp data-size="sm" />
          {t("exercise.image.change.cta")}
        </button>
      )}

      {exerciseImageChange.on && (
        <form
          data-stack="y"
          encType="multipart/form-data"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...exerciseImageChange.props.target}
        >
          <div data-cross="center" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
            <label
              className="c-button"
              data-cross="center"
              data-disp="flex"
              data-grow="1"
              data-main="center"
              data-variant="secondary"
              data-wrap="nowrap"
              style={label}
              tabIndex={0}
              {...ui.Gap.cluster}
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

            <ui.IconButton
              aria-label={t("app.save")}
              disabled={!image.isSelected || mutation.isLoading}
              title={t("app.save")}
              tone="positive"
              type="submit"
            >
              <Check data-size="sm" />
            </ui.IconButton>

            <ui.IconButton
              aria-label={t("app.cancel")}
              onClick={bg.exec([image.actions.clearFile, mutation.reset, exerciseImageChange.disable])}
              title={t("app.cancel")}
            >
              <X data-size="sm" />
            </ui.IconButton>
          </div>

          <ui.Meta>{t("exercise.image.change.hint")}</ui.Meta>

          {mutation.isError && <ui.Output>{t("exercise.image.change.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
