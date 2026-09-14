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
        <div className="c-card" data-gap="0" data-md-px="2" data-p="3" data-pb="0">
          <div data-color="neutral-500" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
            <Flag data-size="xs" fill="currentColor" />
            {t("measurements.body_weight.history.reference")}
          </div>

          <table>
            <tbody>
              <BodyWeightMeasurementRow measurement={reference} previous={previous(reference)} />
            </tbody>
          </table>
        </div>
      )}

      <table data-mt="2">
        <thead>
          <tr data-color="neutral-500" data-fs="xs" data-ls="wide" data-transform="uppercase">
            <th
              data-color="neutral-600"
              data-fs="xs"
              data-fw="regular"
              data-md-pr="1"
              data-pl="0"
              data-pr="1-5"
              data-py="1"
            >
              {t("measurements.body_weight.history.date")}
            </th>
            <th
              data-color="neutral-600"
              data-fs="xs"
              data-fw="regular"
              data-md-px="1"
              data-px="1-5"
              data-py="1"
            >
              <div data-main="end" data-stack="x">
                {t("measurements.body_weight.history.weight")}
              </div>
            </th>
            <th
              data-color="neutral-600"
              data-fs="xs"
              data-fw="regular"
              data-md-px="1"
              data-px="1-5"
              data-py="1"
            >
              <div data-main="end" data-stack="x">
                {t("measurements.body_weight.history.delta")}
              </div>
            </th>
            <th data-md-pl="1" data-pl="1-5" data-pr="0" data-py="1" />
          </tr>
        </thead>

        <tbody>
          {visible.map((measurement) => (
            <BodyWeightMeasurementRow
              key={measurement.id}
              measurement={measurement}
              previous={previous(measurement)}
            />
          ))}
        </tbody>
      </table>

      {(hidden > 0 || all.on) && (
        <div data-mt="2">
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
        </div>
      )}
    </div>
  );
}
