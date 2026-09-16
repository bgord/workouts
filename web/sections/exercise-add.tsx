import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ImageUp, Plus } from "lucide-react";
import { Form } from "../../app/services/exercise-add-form";
import { ButtonClear, Dialog, DialogError, DialogFooter, DialogHeader } from "../components";
import { catalogRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];

const dropzone = bg.Rhythm(144).times(1).height;

export function ExerciseAdd(props: { toggle: bg.UseToggleReturnType }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const name = bg.useTextField(Form.name.field);
  const description = bg.useTextField(Form.description.field);
  const image = bg.useFile("exercise-image", { mimeTypes, maxSizeBytes: 10_000_000 });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      form.append("name", name.value ?? "");
      form.append("description", description.value ?? "");
      if (image.data) form.append("file", image.data);

      return fetch("/api/exercises/add", { method: "POST", body: form, credentials: "include" });
    },
    onSuccess: async (_, context) => {
      props.toggle.disable();
      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
      bg.Fields.clearAll([name, description]);
      image.actions.clearFile();
      context.form?.reset();
    },
  });

  return (
    <Dialog {...props.toggle}>
      <DialogHeader disabled={mutation.isLoading} onClose={props.toggle.disable}>
        {t("exercise.add.cta")}
      </DialogHeader>

      <form
        aria-busy={mutation.isLoading}
        data-gap="6"
        data-stack="y"
        encType="multipart/form-data"
        onSubmit={mutation.handleSubmit}
      >
        <div data-gap="2" data-stack="y">
          <label
            data-bc="neutral-700"
            data-br="md"
            data-bs={image.isSelected ? "solid" : "dashed"}
            data-bw="hairline"
            data-color="neutral-400"
            data-cross="center"
            data-cursor="pointer"
            data-fs="xs"
            data-gap="1-5"
            data-hover-bc="brand-500"
            data-main="center"
            data-overflow="hidden"
            data-p={image.isSelected ? "0" : "4"}
            data-stack="y"
            data-transform="center"
            style={dropzone}
            {...image.label.props}
          >
            {image.isSelected ? (
              <img
                alt=""
                data-bg="neutral-0"
                data-height="100%"
                data-object-fit="contain"
                data-width="100%"
                src={image.preview}
              />
            ) : (
              <>
                <ImageUp data-color="neutral-500" data-size="md" />
                <span data-color="neutral-300">{t("exercise.add.image.cta")}</span>
              </>
            )}

            <input
              className="c-visually-hidden"
              disabled={image.isSelected}
              onChange={image.actions.selectFile}
              required
              type="file"
              {...image.input.props}
            />
          </label>

          <output
            data-color="neutral-500"
            data-cross="center"
            data-fs="xs"
            data-gap="2"
            data-stack="x"
            data-wrap="nowrap"
          >
            {image.isSelected ? (
              <>
                <span data-transform="truncate">
                  {t("exercise.add.image.selected", { name: image.data.name })}
                </span>

                <button
                  className="c-link"
                  data-color="neutral-400"
                  data-fs="xs"
                  data-shrink="0"
                  onClick={image.actions.clearFile}
                  type="button"
                >
                  {t("exercise.add.image.replace")}
                </button>
              </>
            ) : (
              t("exercise.add.image.hint")
            )}
          </output>
        </div>

        <div data-gap="1-5" data-stack="y">
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

        <div data-gap="1-5" data-stack="y">
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

        {mutation.isError && <DialogError>{t("exercise.add.error")}</DialogError>}

        <DialogFooter disabled={mutation.isLoading} onCancel={props.toggle.disable}>
          <ButtonClear
            disabled={name.unchanged && description.unchanged && !image.isSelected}
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
        </DialogFooter>
      </form>
    </Dialog>
  );
}
