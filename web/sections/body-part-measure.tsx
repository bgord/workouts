import * as bg from "@bgord/ui";
import { Plus } from "lucide-react";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";
import { DateFormat } from "../services/date-format";
import { BodyPartMeasureRow } from "./body-part-measure-row";

export function BodyPartMeasure() {
  const t = bg.useTranslations();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  const bodyPartMeasure = bg.useToggle({ name: "body-part-measure" });

  const today = DateFormat.todayISO();

  const measuredOn = bg.useDateField({ name: "body-part-measured-on", defaultValue: today });

  if (!bodyParts.actions.measure.available) return null;

  return (
    <>
      <button
        className="c-button"
        data-md-grow="1"
        data-variant="primary"
        disabled={!bodyParts.actions.measure.enabled}
        onClick={bodyPartMeasure.enable}
        type="button"
        {...bodyPartMeasure.props.controller}
      >
        <Plus data-size="sm" />
        {t("measurements.body_parts.measure.header")}
      </button>

      <ui.Dialog data-md-overflow="auto" data-overflow="hidden" {...bodyPartMeasure}>
        <ui.DialogHeader onClose={bodyPartMeasure.disable}>
          {t("measurements.body_parts.measure.header")}
        </ui.DialogHeader>

        <div data-minh="0" data-stack="y" {...ui.Gap.related}>
          <div data-stack="y" {...ui.Gap.field}>
            <label {...measuredOn.label.props}>{t("measurements.body_parts.measure.date.label")}</label>

            <input
              className="c-input"
              data-md-width="100%"
              data-self="start"
              data-width="auto"
              type="date"
              {...measuredOn.input.props}
              max={today}
            />
          </div>

          <ul data-md-minh="unset" data-minh="0" data-overflow="auto" data-stack="y">
            {bodyParts.data.map((bodyPart, index) => (
              <BodyPartMeasureRow
                first={index === 0}
                key={bodyPart.id}
                measuredOn={measuredOn.value}
                {...bodyPart}
              />
            ))}
          </ul>
        </div>
      </ui.Dialog>
    </>
  );
}
