import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileUp, Upload } from "lucide-react";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

const mimeTypes = ["text/csv"];
const maxSizeBytes = 1_048_576;

export function DailyStepsImport() {
  const t = bg.useTranslations();
  const router = useRouter();

  const dailyStepsImport = bg.useToggle({ name: "daily-steps-import" });

  const file = bg.useFile("daily-steps-import-file", { mimeTypes, maxSizeBytes });

  const mutation = bg.useMutation({
    perform: () => {
      const form = new FormData();

      if (file.data) form.append("file", file.data);

      return fetch("/api/measurements/daily-steps/import", {
        method: "POST",
        body: form,
        credentials: "include",
        headers: bg.TimeZoneOffset.get(),
      });
    },
    onSuccess: async () => {
      dailyStepsImport.disable();
      file.actions.clearFile();
      await router.invalidate({ filter: (match) => match.routeId === dailyStepsRoute.id, sync: true });
    },
  });

  const close = bg.exec([file.actions.clearFile, mutation.reset, dailyStepsImport.disable]);

  return (
    <>
      <bg.MenuItem aria-haspopup="dialog" onClick={dailyStepsImport.enable}>
        <Upload data-size="sm" />
        {t("measurements.daily_steps.import.header")}
      </bg.MenuItem>

      <ui.Dialog {...dailyStepsImport}>
        <ui.DialogHeader>{t("measurements.daily_steps.import.header")}</ui.DialogHeader>

        <form
          aria-busy={mutation.isLoading}
          data-stack="y"
          encType="multipart/form-data"
          onSubmit={mutation.handleSubmit}
          {...ui.Gap.stack}
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
                  <ui.DropzoneTitle>{t("measurements.daily_steps.import.select.cta")}</ui.DropzoneTitle>
                </>
              )}

              <ui.DropzoneInput file={file} />
            </ui.Dropzone>

            <div data-stack="x" {...ui.Gap.cluster}>
              <ui.TextLinkAnchor
                data-shrink="0"
                download
                href="/public/daily-steps-template.csv"
                rel="noopener"
                target="_blank"
              >
                <Download data-size="xs" />
                {t("measurements.daily_steps.import.template.cta")}
              </ui.TextLinkAnchor>
            </div>
          </div>

          {mutation.isError && <ui.DialogError>{t("measurements.daily_steps.import.error")}</ui.DialogError>}

          <ui.DialogFooter
            disabled={mutation.isLoading}
            onCancel={close}
            start={
              <ui.ButtonClear
                disabled={!file.isSelected}
                onClick={bg.exec([file.actions.clearFile, mutation.reset])}
              />
            }
          >
            <button
              className="c-button"
              data-variant="primary"
              disabled={!file.isSelected || mutation.isLoading}
              type="submit"
            >
              <Upload data-size="sm" />
              {t("measurements.daily_steps.import.cta")}
            </button>
          </ui.DialogFooter>
        </form>
      </ui.Dialog>
    </>
  );
}
