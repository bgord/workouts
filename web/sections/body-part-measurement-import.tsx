import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileUp, Upload } from "lucide-react";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

const mimeTypes = ["text/csv"];
const maxSizeBytes = 1_024_000;

export function BodyPartMeasurementImport() {
  const t = bg.useTranslations();
  const router = useRouter();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  const bodyPartMeasurementImport = bg.useToggle({ name: "body-part-measurement-import" });

  const file = bg.useFile("body-part-measurement-import-file", { mimeTypes, maxSizeBytes });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      if (file.data) form.append("file", file.data);

      return fetch("/api/measurements/body-part/import", {
        method: "POST",
        body: form,
        credentials: "include",
      });
    },
    onSuccess: async () => {
      bodyPartMeasurementImport.disable();
      file.actions.clearFile();
      await router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true });
    },
  });

  const close = bg.exec([file.actions.clearFile, mutation.reset, bodyPartMeasurementImport.disable]);

  if (!bodyParts.actions.import.available) return null;

  return (
    <>
      <ui.IconButton
        aria-label={t("measurements.body_parts.import.header")}
        disabled={!bodyParts.actions.import.enabled}
        onClick={bodyPartMeasurementImport.enable}
        title={t("measurements.body_parts.import.header")}
        {...ui.describedByHint(bodyParts.actions.import, "body-part-import-hint")}
        {...bodyPartMeasurementImport.props.controller}
      >
        <Upload data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...bodyPartMeasurementImport}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={close}>
          {t("measurements.body_parts.import.header")}
        </ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          encType="multipart/form-data"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.section}
        >
          <div data-stack="y" {...ui.Gap.related}>
            <ui.Dropzone file={file}>
              {file.isSelected && (
                <>
                  <FileSpreadsheet data-color="neutral-400" data-size="md" />
                  <ui.DropzoneFileName>{file.data.name}</ui.DropzoneFileName>
                </>
              )}

              {!file.isSelected && (
                <>
                  <FileUp data-color="neutral-400" data-size="md" />
                  <ui.DropzoneTitle>{t("measurements.body_parts.import.select.cta")}</ui.DropzoneTitle>
                </>
              )}

              <ui.DropzoneInput file={file} />
            </ui.Dropzone>

            <div data-stack="x" {...ui.Gap.cluster}>
              <ui.TextLinkAnchor
                data-shrink="0"
                download
                href="/api/measurements/body-part/import/template"
                rel="noopener"
                target="_blank"
              >
                <Download data-size="xs" />
                {t("measurements.body_parts.import.template.cta")}
              </ui.TextLinkAnchor>
            </div>
          </div>

          {mutation.isError && <ui.DialogError>{t("measurements.body_parts.import.error")}</ui.DialogError>}

          <ui.DialogFooter disabled={mutation.isLoading} onCancel={close}>
            <ui.ButtonClear
              disabled={!file.isSelected}
              onClick={bg.exec([file.actions.clearFile, mutation.reset])}
            />

            <button
              className="c-button"
              data-variant="primary"
              disabled={!file.isSelected || mutation.isLoading}
              type="submit"
            >
              <Upload data-size="sm" />
              {t("measurements.body_parts.import.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
