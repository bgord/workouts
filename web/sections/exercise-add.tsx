import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ArrowRight, ImageUp, Pencil, Plus } from "lucide-react";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import * as ui from "../components";
import { ResistanceKit } from "../kits/resistance.kit";
import { catalogRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSizeBytes = 10_000_000;

export function ExerciseAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = catalogRoute.useNavigate();
  const { exercises } = catalogRoute.useLoaderData();

  const exerciseAdd = bg.useToggle({ name: "exercise-add" });
  const exerciseAddImage = bg.useToggle({ name: "exercise-add-image" });

  const name = bg.useTextField(Form.name.field);
  const description = bg.useTextField(Form.description.field);
  const resistance = bg.useTextField<ExerciseResistanceOptions>(Form.resistance.field);

  const metaEnterSubmit = bg.useMetaEnterSubmit();
  const image = bg.useFile("exercise-image", { mimeTypes, maxSizeBytes });
  const Resistance = ResistanceKit[resistance.value ?? Form.resistance.field.defaultValue];

  const next = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    exerciseAddImage.enable();
  };

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      form.append("name", name.value ?? "");
      form.append("description", description.value ?? "");
      form.append("resistance", resistance.value ?? Form.resistance.field.defaultValue);
      form.append("laterality", Form.laterality.field.defaultValue);
      if (image.data) form.append("file", image.data);

      return fetch("/api/exercises/add", { method: "POST", body: form, credentials: "include" });
    },
    onSuccess: async (response) => {
      const { id } = await response.json();

      close();

      await navigate({ params: { exerciseId: id }, to: "/catalog/exercise/$exerciseId" });
      await router.invalidate({ filter: (match) => match.routeId === catalogRoute.id, sync: true });
    },
  });

  const clear = bg.exec([
    name.clear,
    description.clear,
    resistance.clear,
    image.actions.clearFile,
    exerciseAddImage.disable,
    mutation.reset,
  ]);
  const close = bg.exec([clear, exerciseAdd.disable]);

  if (!exercises.actions.add.available) return null;

  return (
    <>
      <ui.ActionHint {...exercises.actions.add} id="exercise-add-hint" />

      <button
        className="c-button"
        data-md-grow="1"
        data-variant="primary"
        disabled={!exercises.actions.add.enabled}
        onClick={exerciseAdd.enable}
        type="button"
        {...ui.describedByHint(exercises.actions.add, "exercise-add-hint")}
        {...exerciseAdd.props.controller}
      >
        <Plus data-size="sm" />
        {t("exercise.add.cta")}
      </button>

      <ui.Dialog {...exerciseAdd}>
        <ui.DialogHeader>{t("exercise.add.cta")}</ui.DialogHeader>

        {exerciseAddImage.off && (
          <form data-stack="y" onSubmit={next} {...ui.Gap.stack}>
            <div data-stack="y" {...ui.Gap.field}>
              <label {...name.label.props}>{t("exercise.add.name.label")}</label>

              <input
                className="c-input"
                data-width="100%"
                maxLength={Form.name.pattern.max}
                minLength={Form.name.pattern.min}
                placeholder={t("exercise.add.name.placeholder")}
                required
                {...name.input.props}
              />
            </div>

            <ui.ExerciseResistancePicker field={resistance} />

            <div data-stack="y" {...ui.Gap.field}>
              <label {...description.label.props}>{t("exercise.add.description.label")}</label>

              <textarea
                className="c-textarea"
                placeholder={t("exercise.add.description.placeholder")}
                rows={3}
                {...bg.Form.textarea(Form.description.pattern)}
                {...description.input.props}
                {...metaEnterSubmit}
              />
            </div>

            <ui.DialogFooter
              onCancel={close}
              start={
                <ui.ButtonClear
                  disabled={bg.Fields.allUnchanged([name, description, resistance]) && !image.isSelected}
                  onClick={clear}
                />
              }
            >
              <button className="c-button" data-variant="primary" type="submit">
                {t("exercise.add.next.cta")}
                <ArrowRight data-size="sm" />
              </button>
            </ui.DialogFooter>
          </form>
        )}

        {exerciseAddImage.on && (
          <form
            aria-busy={mutation.isLoading}
            data-stack="y"
            encType="multipart/form-data"
            onSubmit={mutation.handleSubmit}
            {...ui.Gap.stack}
          >
            <div
              data-bc="alpha-medium"
              data-br="md"
              data-bs="solid"
              data-bw="hairline"
              data-stack="x"
              {...ui.Spacing.surfaceCompact}
              {...ui.Gap.related}
            >
              <span aria-hidden data-shrink="0" data-stack="x">
                <ui.ExerciseImagePlaceholder size={ui.ExerciseImageSize.xs} />
              </span>

              <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
                <span data-color="neutral-100" data-fw="medium" data-transform="truncate" title={name.value}>
                  {name.value}
                </span>

                <div data-color="neutral-500" data-fs="xs" data-stack="x" {...ui.Gap.cluster}>
                  <Resistance.Badge />

                  <span data-transform="truncate">{description.value}</span>
                </div>
              </div>

              <ui.IconButton
                aria-label={t("exercise.add.details.edit", { name: name.value ?? "" })}
                data-shrink="0"
                disabled={mutation.isLoading}
                onClick={exerciseAddImage.disable}
                title={t("exercise.add.details.edit", { name: name.value ?? "" })}
              >
                <Pencil data-size="sm" />
              </ui.IconButton>
            </div>

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

              <output data-color="neutral-500" data-fs="xs" data-stack="x" {...ui.Gap.cluster}>
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

            {mutation.isError && <ui.DialogError>{t("exercise.add.error")}</ui.DialogError>}

            <ui.DialogFooter
              disabled={mutation.isLoading}
              onCancel={close}
              start={<ui.ButtonClear onClick={clear} />}
            >
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
        )}
      </ui.Dialog>
    </>
  );
}
