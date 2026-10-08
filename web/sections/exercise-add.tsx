import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ArrowRight, ImageUp, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { Form } from "../../app/services/exercise-add-form";
import type { ExerciseLateralityOptions } from "../../modules/exercises/value-objects/exercise-laterality-options";
import type { ExerciseResistanceOptions } from "../../modules/exercises/value-objects/exercise-resistance-options";
import * as ui from "../components";
import { LateralityKit } from "../kits/laterality.kit";
import { ResistanceKit } from "../kits/resistance.kit";
import { catalogRoute } from "../router";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];
const maxSizeBytes = 10_000_000;

type ExerciseAddStep = "details" | "classification" | "image";

function ExerciseAddSummary(props: {
  name: string;
  description: string;
  badges?: React.ReactNode;
  editLabel: string;
  onEdit: () => void;
  disabled?: boolean;
}) {
  return (
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
        <span data-color="neutral-100" data-fw="medium" data-transform="truncate" title={props.name}>
          {props.name}
        </span>

        <div data-color="neutral-500" data-fs="xs" data-stack="x" {...ui.Gap.cluster}>
          {props.badges}

          <span data-transform="truncate">{props.description}</span>
        </div>
      </div>

      <ui.IconButton
        aria-label={props.editLabel}
        data-shrink="0"
        disabled={props.disabled}
        onClick={props.onEdit}
        title={props.editLabel}
      >
        <Pencil data-size="sm" />
      </ui.IconButton>
    </div>
  );
}

export function ExerciseAdd() {
  const t = bg.useTranslations();
  const router = useRouter();
  const navigate = catalogRoute.useNavigate();
  const { exercises } = catalogRoute.useLoaderData();

  const exerciseAdd = bg.useToggle({ name: "exercise-add" });
  const [step, setStep] = useState<ExerciseAddStep>("details");

  const name = bg.useTextField(Form.name.field);
  const description = bg.useTextField(Form.description.field);
  const resistance = bg.useTextField<ExerciseResistanceOptions>(Form.resistance.field);
  const laterality = bg.useTextField<ExerciseLateralityOptions>(Form.laterality.field);

  const metaEnterSubmit = bg.useMetaEnterSubmit();
  const image = bg.useFile("exercise-image", { mimeTypes, maxSizeBytes });
  const Resistance = ResistanceKit[resistance.value ?? Form.resistance.field.defaultValue];
  const Laterality = LateralityKit[laterality.value ?? Form.laterality.field.defaultValue];

  const goTo = (next: ExerciseAddStep) => () => setStep(next);

  const advance = (next: ExerciseAddStep) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStep(next);
  };

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      form.append("name", name.value ?? "");
      form.append("description", description.value ?? "");
      form.append("resistance", resistance.value ?? Form.resistance.field.defaultValue);
      form.append("laterality", laterality.value ?? Form.laterality.field.defaultValue);
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
    laterality.clear,
    image.actions.clearFile,
    goTo("details"),
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

        {step === "details" && (
          <form data-stack="y" onSubmit={advance("classification")} {...ui.Gap.stack}>
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
                  disabled={
                    bg.Fields.allUnchanged([name, description, resistance, laterality]) && !image.isSelected
                  }
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

        {step === "classification" && (
          <form data-stack="y" onSubmit={advance("image")} {...ui.Gap.stack}>
            <ExerciseAddSummary
              description={description.value ?? ""}
              editLabel={t("exercise.add.details.edit", { name: name.value ?? "" })}
              name={name.value ?? ""}
              onEdit={goTo("details")}
            />

            <ui.ExerciseResistancePicker field={resistance} />

            <ui.ExerciseLateralityPicker field={laterality} />

            <ui.DialogFooter onCancel={close} start={<ui.ButtonClear onClick={clear} />}>
              <button className="c-button" data-variant="primary" type="submit">
                {t("exercise.add.next.cta")}
                <ArrowRight data-size="sm" />
              </button>
            </ui.DialogFooter>
          </form>
        )}

        {step === "image" && (
          <form
            aria-busy={mutation.isLoading}
            data-stack="y"
            encType="multipart/form-data"
            onSubmit={mutation.handleSubmit}
            {...ui.Gap.stack}
          >
            <ExerciseAddSummary
              badges={
                <>
                  <Resistance.Badge />

                  <Laterality.Badge />
                </>
              }
              description={description.value ?? ""}
              disabled={mutation.isLoading}
              editLabel={t("exercise.add.classification.edit", { name: name.value ?? "" })}
              name={name.value ?? ""}
              onEdit={goTo("classification")}
            />

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
