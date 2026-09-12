// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Download, Scale, Upload } from "lucide-react";
import { Main } from "../components";
import { measurementsRoute } from "../router";
import {
  BodyWeightMeasure,
  BodyWeightMeasurementImport,
  BodyWeightMeasurementList,
  BodyWeightProgressChart,
  BodyWeightStats,
} from "../sections";

export function Measurements() {
  const t = bg.useTranslations();
  const { measurements } = measurementsRoute.useLoaderData();
  const bodyWeightImport = bg.useToggle({ name: "body-weight-measurement-import" });

  return (
    <Main>
      <div data-cross="center" data-gap="3" data-stack="x">
        <h1 data-color="neutral-0" data-fs="2xl" data-fw="black" data-grow="1" data-md-fs="xl">
          {t("measurements.body_weight.header")}
        </h1>

        <button
          className="c-button"
          data-variant="ghost"
          onClick={bodyWeightImport.toggle}
          type="button"
          {...bodyWeightImport.props.controller}
        >
          <Upload data-size="sm" />
          {t("measurements.body_weight.import.toggle.cta")}
        </button>

        {measurements.length > 0 && (
          <a
            className="c-button"
            data-variant="ghost"
            download
            href="/api/measurements/body-weight/export"
            rel="noopener"
            target="_blank"
          >
            <Download data-size="sm" />
          </a>
        )}
      </div>

      {bodyWeightImport.on && <BodyWeightMeasurementImport toggle={bodyWeightImport} />}

      <BodyWeightMeasure />

      {measurements.length === 0 && (
        <div
          className="c-card"
          data-cross="center"
          data-gap="1"
          data-py="8"
          data-stack="y"
          data-variant="flat"
        >
          <Scale data-color="neutral-600" data-size="md" />

          <div data-color="neutral-300" data-fs="sm" data-mt="2">
            {t("measurements.body_weight.empty")}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("measurements.body_weight.empty.hint")}
          </div>
        </div>
      )}

      {measurements.length > 0 && (
        <div data-gap="6" data-stack="y">
          <BodyWeightStats measurements={measurements} />

          <BodyWeightProgressChart measurements={measurements} />

          <div data-gap="3" data-stack="y">
            <div className="c-card-title" data-grow="1">
              {t("measurements.body_weight.history")}
            </div>

            <BodyWeightMeasurementList measurements={measurements} />
          </div>
        </div>
      )}
    </Main>
  );
}
