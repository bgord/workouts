import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { Select } from "../components";
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
  const pinned = reference && !visible.includes(reference) ? reference : undefined;

  const previous = (measurement: BodyWeightMeasurement) =>
    props.measurements[props.measurements.indexOf(measurement) + 1];

  return (
    <div data-gap="3" data-stack="y">
      <Select
        aria-label={t("measurements.body_weight.history.month.label")}
        data-self="start"
        {...month.input.props}
      >
        <option value="">{t("measurements.body_weight.history.month.all")}</option>
        {months.map((value) => (
          <option key={value} value={value}>
            {DateFormat.month(language, new Date(`${value}-01`))} (
            {props.measurements.filter((measurement) => measurement.measuredOn.startsWith(value)).length})
          </option>
        ))}
      </Select>

      <ul
        className="c-card"
        data-md-bw="none"
        data-md-p="2-5"
        data-md-px="0"
        data-p="4"
        data-stack="y"
        data-variant="flat"
      >
        {pinned && (
          <>
            <BodyWeightMeasurementRow index={0} measurement={pinned} previous={previous(pinned)} />

            <li data-bct="alpha-subtle" data-bst="solid" data-bwt="hairline" data-mb="2" data-mt="2" />
          </>
        )}

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
