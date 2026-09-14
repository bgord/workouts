import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp, Flag } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { ButtonClear, Select } from "../components";
import { DateFormat } from "../services/date-format";
import { BodyWeightMeasurementRow } from "./body-weight-measurement-row";

const VISIBLE = 15;

export function BodyWeightMeasurementList(props: { measurements: ReadonlyArray<BodyWeightMeasurement> }) {
  const t = bg.useTranslations();
  const language = bg.useLanguage();
  const all = bg.useToggle({ name: "body-weight-measurement-list-all" });
  const month = bg.useTextField({ name: "month", defaultValue: "" });

  const months = [...new Set(props.measurements.map((measurement) => measurement.measuredOn.slice(0, 7)))];

  const filtered = props.measurements.filter((measurement) =>
    measurement.measuredOn.startsWith(month.value ?? ""),
  );
  const visible = month.value || all.on ? filtered : filtered.slice(0, VISIBLE);
  const hidden = filtered.length - visible.length;

  const reference = props.measurements.find((measurement) => measurement.reference);

  const previous = (measurement: BodyWeightMeasurement) =>
    props.measurements[props.measurements.indexOf(measurement) + 1];

  return (
    <div data-gap="3" data-stack="y">
      <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
        <div data-md-grow="1">
          <Select aria-label={t("measurements.body_weight.history.month.label")} {...month.input.props}>
            <option value="">{t("measurements.body_weight.history.month.all")}</option>
            {months.map((value) => (
              <option key={value} value={value}>
                {DateFormat.month(language, new Date(`${value}-01`))} (
                {props.measurements.filter((measurement) => measurement.measuredOn.startsWith(value)).length})
              </option>
            ))}
          </Select>
        </div>

        {month.value && <ButtonClear onClick={month.clear} />}
      </div>

      {reference && (
        <ul className="c-card" data-gap="0" data-md-px="2" data-p="3" data-pb="0" data-stack="y">
          <li data-color="neutral-500" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
            <Flag data-size="xs" fill="currentColor" />
            {t("measurements.body_weight.history.reference")}
          </li>

          <BodyWeightMeasurementRow index={0} measurement={reference} previous={previous(reference)} />
        </ul>
      )}

      <ul
        className="c-card"
        data-md-bw="none"
        data-md-p="2-5"
        data-md-px="0"
        data-p="4"
        data-stack="y"
        data-variant="flat"
      >
        {visible.map((measurement, index) => (
          <BodyWeightMeasurementRow
            index={index}
            key={measurement.id}
            measurement={measurement}
            previous={previous(measurement)}
          />
        ))}

        {(hidden > 0 || all.on) && (
          <li data-mt="2">
            <button
              className="c-link"
              data-color="neutral-400"
              data-cross="center"
              data-fs="xs"
              data-gap="1"
              data-stack="x"
              onClick={all.toggle}
              type="button"
            >
              {all.on ? (
                <>
                  {t("measurements.body_weight.history.less")}
                  <ChevronUp data-size="xs" />
                </>
              ) : (
                <>
                  {t("measurements.body_weight.history.more", { count: hidden })}
                  <ChevronDown data-size="xs" />
                </>
              )}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
}
