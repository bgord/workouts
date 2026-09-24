import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Check, FileImage, ImageUp, X } from "lucide-react";
import * as ui from "../components";
import { exerciseRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSizeBytes = 10_000_000;

export function ExerciseImageChange() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercise } = exerciseRoute.useLoaderData();

  const exerciseImageChange = bg.useToggle({ name: "exercise-image-change" });

  const image = bg.useFile("exercise-image-change-file", { mimeTypes, maxSizeBytes });

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
      await router.invalidate({ filter: (match) => match.routeId === exerciseRoute.id, sync: true });
    },
  });

  if (!exercise.actions.imageChange.available) {
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
          {...exerciseImageChange.props.controller}
        >
          <ImageUp data-size="sm" />
          {t("exercise.image.change.cta")}
        </button>
      )}

      {exerciseImageChange.on && (
        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          encType="multipart/form-data"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.cluster}
          {...exerciseImageChange.props.target}
        >
          <div data-stack="x" {...ui.Gap.inline}>
            <ui.FileButton data-grow="1" file={image}>
              {image.isSelected ? (
                <FileImage data-color="neutral-400" data-shrink="0" data-size="sm" />
              ) : (
                <ImageUp data-shrink="0" data-size="sm" />
              )}

              <span data-transform="truncate">
                {image.isSelected ? image.data.name : t("exercise.image.change.select.cta")}
              </span>

              <ui.DropzoneInput file={image} />
            </ui.FileButton>

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

          <small>{t("exercise.image.change.hint")}</small>

          {mutation.isError && <ui.Output>{t("exercise.image.change.error")}</ui.Output>}
        </form>
      )}
    </div>
  );
}
