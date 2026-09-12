import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { ButtonClear } from "../components";
import { measurementsRoute } from "../router";

const mimeTypes = ["text/csv"];

export function BodyWeightMeasurementImport(props: { toggle: bg.UseToggleReturnType }) {
  const t = bg.useTranslations();
  const router = useRouter();

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
      props.toggle.disable();
      file.actions.clearFile();

      await router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true });
    },
  });

  return (
    <form
      className="c-card"
      data-gap="3"
      data-md-p="2-5"
      data-stack="y"
      encType="multipart/form-data"
      onSubmit={mutation.handleSubmit}
      {...props.toggle.props.target}
    >
      <div data-cross="center" data-gap="3" data-md-stack="y" data-stack="x">
        <label
          className="c-button"
          data-cross="center"
          data-disp="flex"
          data-main="center"
          data-md-width="100%"
          data-variant="secondary"
          {...file.label.props}
        >
          <span>{t("measurements.body_weight.import.select.cta")}</span>
          <input
            className="c-visually-hidden"
            disabled={file.isSelected}
            onChange={file.actions.selectFile}
            required
            type="file"
            {...file.input.props}
          />
        </label>

        {file.isSelected && (
          <output data-color="neutral-300" data-fs="xs" data-md-width="100%">
            {t("measurements.body_weight.import.selected", { name: file.data.name })}
          </output>
        )}

        <div data-cross="center" data-gap="1" data-md-width="100%" data-ml="auto" data-stack="x">
          <button
            className="c-button"
            data-md-grow="1"
            data-variant="secondary"
            disabled={!file.isSelected || mutation.isLoading}
            type="submit"
          >
            {t("measurements.body_weight.import.cta")}
          </button>

          <ButtonClear
            data-md-grow="1"
            disabled={!file.isSelected}
            onClick={bg.exec([file.actions.clearFile, mutation.reset])}
          />
        </div>
      </div>

      <a
        className="c-link"
        data-fs="xs"
        data-self="start"
        download
        href="/public/body-weight-measurements-template.csv"
        rel="noopener"
        target="_blank"
      >
        {t("measurements.body_weight.import.template.cta")}
      </a>

      {mutation.isError && (
        <output data-color="danger-400" data-fs="sm">
          {t("measurements.body_weight.import.error")}
        </output>
      )}
    </form>
  );
}
