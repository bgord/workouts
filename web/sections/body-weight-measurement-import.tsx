import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileUp, Upload } from "lucide-react";
import * as ui from "../components";
import { measurementsRoute } from "../router";

const mimeTypes = ["text/csv"];
const maxSizeBytes = 1_024_000;

export function BodyWeightMeasurementImport() {
  const t = bg.useTranslations();
  const router = useRouter();

  const bodyWeightMeasurementImport = bg.useToggle({ name: "body-weight-measurement-import" });

  const file = bg.useFile("body-weight-measurement-import-file", { mimeTypes, maxSizeBytes });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      if (file.data) form.append("file", file.data);

      return fetch("/api/measurements/body-weight/import", {
        method: "POST",
        body: form,
        credentials: "include",
      });
    },
    onSuccess: async () => {
      bodyWeightMeasurementImport.disable();
      file.actions.clearFile();
      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  const close = bg.exec([file.actions.clearFile, mutation.reset, bodyWeightMeasurementImport.disable]);

  return (
    <>
      <ui.IconButton
        aria-label={t("measurements.body_weight.import.header")}
        onClick={bodyWeightMeasurementImport.enable}
        title={t("measurements.body_weight.import.header")}
        {...bodyWeightMeasurementImport.props.controller}
      >
        <Upload data-size="sm" />
      </ui.IconButton>

      <ui.Dialog {...bodyWeightMeasurementImport}>
        <ui.DialogHeader disabled={mutation.isLoading} onClose={close}>
          {t("measurements.body_weight.import.header")}
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
                  <ui.DropzoneTitle>{t("measurements.body_weight.import.select.cta")}</ui.DropzoneTitle>
                </>
              )}

              <ui.DropzoneInput file={file} />
            </ui.Dropzone>

            <div data-cross="center" data-stack="x" {...ui.Gap.cluster}>
              <ui.TextLinkAnchor
                data-shrink="0"
                download
                href="/public/body-weight-measurements-template.csv"
                rel="noopener"
                target="_blank"
              >
                <Download data-size="xs" />
                {t("measurements.body_weight.import.template.cta")}
              </ui.TextLinkAnchor>
            </div>
          </div>

          {mutation.isError && <ui.DialogError>{t("measurements.body_weight.import.error")}</ui.DialogError>}

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
              {t("measurements.body_weight.import.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
