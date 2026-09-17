import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Download, FileSpreadsheet, FileUp, Upload, X } from "lucide-react";
import { Dialog, DialogError, DialogFooter, DialogHeader, TextLinkAnchor } from "../components";
import { measurementsRoute } from "../router";

const mimeTypes = ["text/csv"];

export function BodyWeightMeasurementImport(props: bg.UseToggleReturnType) {
  const t = bg.useTranslations();
  const router = useRouter();
  const { toggle } = bg.extractUseToggle(props);

  const file = bg.useFile("body-weight-measurement-import-file", { mimeTypes, maxSizeBytes: 1_000_000 });

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
      toggle.disable();
      file.actions.clearFile();

      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  const close = bg.exec([file.actions.clearFile, mutation.reset, toggle.disable]);

  return (
    <Dialog {...toggle}>
      <DialogHeader disabled={mutation.isLoading} onClose={close}>
        {t("measurements.body_weight.import.header")}
      </DialogHeader>

      <form
        aria-busy={mutation.isLoading}
        data-gap="6"
        data-stack="y"
        encType="multipart/form-data"
        onSubmit={mutation.handleSubmit}
      >
        <div data-gap="3" data-stack="y">
          {file.isSelected ? (
            <div
              data-bc="neutral-700"
              data-br="sm"
              data-bs="solid"
              data-bw="hairline"
              data-color="neutral-100"
              data-cross="center"
              data-fs="sm"
              data-gap="1-5"
              data-px="3"
              data-py="5"
              data-stack="y"
            >
              <FileSpreadsheet data-color="neutral-400" data-size="md" />

              <span data-maxw="100%" data-transform="truncate">
                {file.data.name}
              </span>

              <button
                data-color="neutral-400"
                data-cross="center"
                data-cursor="pointer"
                data-fs="xs"
                data-gap="1"
                data-hover-color="neutral-0"
                data-stack="x"
                onClick={bg.exec([file.actions.clearFile, mutation.reset])}
                type="button"
              >
                <X data-size="xs" />
                {t("app.clear")}
              </button>
            </div>
          ) : (
            <label
              data-bc="neutral-700"
              data-br="sm"
              data-bs="dashed"
              data-bw="hairline"
              data-color="neutral-300"
              data-cross="center"
              data-cursor="pointer"
              data-fs="sm"
              data-gap="1-5"
              data-hover-bc="neutral-500"
              data-px="3"
              data-py="5"
              data-stack="y"
              tabIndex={0}
              {...file.label.props}
            >
              <FileUp data-color="neutral-400" data-size="md" />

              {t("measurements.body_weight.import.select.cta")}

              <span data-color="neutral-500" data-fs="xs">
                {t("measurements.body_weight.import.hint")}
              </span>

              <input
                className="c-visually-hidden"
                onChange={file.actions.selectFile}
                required
                type="file"
                {...file.input.props}
              />
            </label>
          )}

          <TextLinkAnchor
            data-self="start"
            download
            href="/public/body-weight-measurements-template.csv"
            rel="noopener"
            target="_blank"
          >
            <Download data-size="xs" />
            {t("measurements.body_weight.import.template.cta")}
          </TextLinkAnchor>
        </div>

        {mutation.isError && <DialogError>{t("measurements.body_weight.import.error")}</DialogError>}

        <DialogFooter disabled={mutation.isLoading} onCancel={close}>
          <button
            className="c-button"
            data-variant="primary"
            disabled={!file.isSelected || mutation.isLoading}
            type="submit"
          >
            <Upload data-size="sm" />
            {t("measurements.body_weight.import.cta")}
          </button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
