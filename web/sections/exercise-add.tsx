import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ImageUp, Plus } from "lucide-react";
import { Form } from "../../app/services/exercise-add-form";
import * as ui from "../components";
import { catalogRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSizeBytes = 10_000_000;

export function ExerciseAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { exercises } = catalogRoute.useLoaderData();

  const exerciseAdd = bg.useToggle({ name: "exercise-add" });

  const name = bg.useTextField(Form.name.field);
  const description = bg.useTextField(Form.description.field);
  const image = bg.useFile("exercise-image", { mimeTypes, maxSizeBytes });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      form.append("name", name.value ?? "");
      form.append("description", description.value ?? "");
      if (image.data) form.append("file", image.data);

      return fetch("/api/exercises/add", { method: "POST", body: form, credentials: "include" });
    },
    onSuccess: async (_, context) => {
      exerciseAdd.disable();
      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
      bg.Fields.clearAll([name, description]);
      image.actions.clearFile();
      context.form?.reset();
    },
  });

  if (!exercises.actions.add.available) return null;

  return (
    <>
      <ui.ActionHint {...exercises.actions.add} />

      <button
        className="c-button"
        data-md-grow="1"
        data-variant="primary"
        disabled={!exercises.actions.add.enabled}
        onClick={exerciseAdd.enable}
        type="button"
        {...exerciseAdd.props.controller}
      >
        <Plus data-size="sm" />
        {t("exercise.add.cta")}
      </button>

      <ui.Dialog {...exerciseAdd}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={exerciseAdd.disable}>
          {t("exercise.add.cta")}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          encType="multipart/form-data"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          <div data-stack="y" {...ui.Gap.field}>
            <ui.Dropzone
              data-overflow="hidden"
              file={image}
              {...bg.Rhythm(144).times(1).style.height}
              {...(image.isSelected ? { "data-p": "0" as const } : {})}
            >
              {image.isSelected && (
                <img
                  alt=""
                  data-bg="neutral-0"
                  data-height="100%"
                  data-object-fit="contain"
                  data-width="100%"
                  src={image.preview}
                />
              )}
              {!image.isSelected && (
                <>
                  <ImageUp data-color="neutral-500" data-size="md" />
                  <ui.DropzoneTitle>{t("exercise.add.image.cta")}</ui.DropzoneTitle>
                </>
              )}

              <ui.DropzoneInput file={image} />
            </ui.Dropzone>

            <output
              data-color="neutral-500"
              data-cross="center"
              data-fs="xs"
              data-stack="x"
              data-wrap="nowrap"
              {...ui.Gap.cluster}
            >
              {image.isSelected && (
                <>
                  <span data-transform="truncate">
                    {t("exercise.add.image.selected", { name: image.data.name })}
                  </span>

                  <ui.TextLink data-shrink="0" onClick={image.actions.clearFile}>
                    {t("exercise.add.image.replace")}
                  </ui.TextLink>
                </>
              )}
              {!image.isSelected && t("exercise.add.image.hint")}
            </output>
          </div>

          <div data-stack="y" {...ui.Gap.field}>
            <label className="c-label" {...name.label.props}>
              {t("exercise.add.name.label")}
            </label>

            <input
              className="c-input"
              data-variant="transparent"
              data-width="100%"
              placeholder={t("exercise.add.name.placeholder")}
              {...bg.Form.input(Form.name.pattern)}
              {...name.input.props}
            />
          </div>

          <div data-stack="y" {...ui.Gap.field}>
            <label className="c-label" {...description.label.props}>
              {t("exercise.add.description.label")}
            </label>

            <textarea
              className="c-textarea"
              data-variant="transparent"
              placeholder={t("exercise.add.description.placeholder")}
              rows={3}
              {...bg.Form.textarea(Form.description.pattern)}
              {...description.input.props}
            />
          </div>

          {mutation.isError && <ui.DialogError>{t("exercise.add.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={exerciseAdd.disable}>
            <ui.ButtonClear
              disabled={bg.Fields.allUnchanged([name, description]) && !image.isSelected}
              onClick={bg.exec([name.clear, description.clear, image.actions.clearFile, mutation.reset])}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={!image.isSelected || mutation.isLoading}
              type="submit"
            >
              <Plus data-size="sm" />
              {t("exercise.add.submit.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
