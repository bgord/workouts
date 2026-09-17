import * as bg from "@bgord/ui";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { IconButton, Select, TextLink } from "../components";
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
    <div data-gap="4" data-stack="y">
      <div data-cross="center" data-gap="2" data-stack="x" data-wrap="nowrap">
        <div data-md-grow="1">
          <Select
            aria-label={t("measurements.body_weight.history.month.label")}
            {...month.input.props}
            {...bg.Autocomplete.off}
          >
            <option value="">{t("measurements.body_weight.history.month.all")}</option>
            {months.map((value) => (
              <option key={value} value={value}>
                {DateFormat.month(language, Temporal.PlainDate.from(`${value}-01`))} (
                {props.measurements.filter((measurement) => measurement.measuredOn.startsWith(value)).length})
              </option>
            ))}
          </Select>
        </div>

        {month.value && (
          <IconButton onClick={month.clear}>
            <X data-size="sm" />
          </IconButton>
        )}
      </div>

      <ul data-stack="y">
        {visible.map((measurement, index) => (
          <BodyWeightMeasurementRow
            first={index === 0}
            goal={reference?.goal}
            key={measurement.id}
            measurement={measurement}
            previous={previous(measurement)}
          />
        ))}
      </ul>

      {(hidden > 0 || all.on) && (
        <TextLink onClick={all.toggle}>
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
        </TextLink>
      )}
    </div>
  );
}
