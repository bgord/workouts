import * as bg from "@bgord/ui";
import { use } from "react";
import type { BodyPartMeasurementListResponse } from "../../modules/measurements/queries/list-body-part-measurements";
import * as ui from "../components";
import { DateFormat } from "../services/date-format";
import { LengthFormat } from "../services/length-format";

export function BodyPartHistory(props: { history: Promise<BodyPartMeasurementListResponse> }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const history = use(props.history);

  return history.data.map((measurement, index) => (
    <ui.HairlineRow
      data-cross="center"
      data-stack="x"
      first={index === 0}
      key={measurement.id}
      tone="subtle"
      {...ui.Spacing.rowCompact}
    >
      <span data-color="neutral-300" data-fs="sm" data-grow="1">
        {DateFormat.plainDay(language, measurement.measuredOn)}
      </span>

      <ui.LengthDelta data-fs="xs" millimeters={measurement.delta} />

      <span
        data-color="neutral-0"
        data-fw="medium"
        data-shrink="0"
        data-transform="font-variant-numeric"
        {...bg.Rhythm(72).times(1).style.minWidth}
        style={{ textAlign: "right" }}
      >
        {t("measurements.body_parts.value", {
          value: LengthFormat.centimeters(measurement.value).toFixed(1),
        })}
      </span>
    </ui.HairlineRow>
  ));
}

export function BodyPartHistoryLoading() {
  const t = bg.useTranslations();

  return (
    <>
      <li className="c-visually-hidden">{t("measurements.body_parts.history.loading")}</li>

      {Array.from({ length: 3 }, (_, index) => (
        <ui.HairlineRow aria-hidden first={index === 0} key={index} tone="subtle">
          <div data-stack="x" {...ui.Spacing.rowCompact}>
            <span data-bg="alpha-subtle" data-br="sm" style={{ width: "40%", height: "1em" }} />
          </div>
        </ui.HairlineRow>
      ))}
    </>
  );
}
