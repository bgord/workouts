import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Form } from "../../app/services/exercise-add-form";
import { catalogRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];

export function ExerciseAdd() {
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
      await router.invalidate({ filter: (route) => route.id === catalogRoute.id, sync: true });
      bg.Fields.clearAll([name, description]);
      image.actions.clearFile();
      context.form?.reset();
    },
  });

  return (
    <form
      className="c-card"
      data-gap="4"
      data-stack="y"
      encType="multipart/form-data"
      onSubmit={mutation.handleSubmit}
    >
      <div data-gap="3" data-stack="y">
        <label className="c-label" data-variant="inline" {...name.label.props}>
          {t("exercise.add.name.label")}
        </label>

        <input
          className="c-input"
          data-mr="auto"
          placeholder={t("exercise.add.name.placeholder")}
          {...bg.Form.input(Form.name.pattern)}
          {...name.input.props}
        />
      </div>

      <textarea
        aria-label={t("exercise.add.description.label")}
        className="c-textarea"
        placeholder={t("exercise.add.description.placeholder")}
        rows={3}
        {...bg.Form.textarea(Form.description.pattern)}
        {...description.input.props}
      />

      <div data-cross="center" data-gap="3" data-stack="x">
        <label
          className="c-button"
          data-cross="center"
          data-disp="flex"
          data-main="center"
          data-variant="secondary"
          {...image.label.props}
        >
          <span>{t("exercise.add.image.cta")}</span>
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
            {t("exercise.add.image.selected", { name: image.data.name })}
          </output>
        )}

        <button
          className="c-button"
          data-ml="auto"
          data-variant="primary"
          disabled={!image.isSelected || mutation.isLoading}
          type="submit"
        >
          {t("exercise.add.submit.cta")}
        </button>

        <button
          className="c-button"
          data-variant="ghost"
          onClick={bg.exec([name.clear, description.clear, image.actions.clearFile, mutation.reset])}
          type="button"
        >
          {t("app.clear")}
        </button>
      </div>

      <div data-color="neutral-400" data-fs="xs">
        {t("exercise.add.image.hint")}
      </div>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("exercise.add.error")}
        </output>
      )}
    </form>
  );
}
