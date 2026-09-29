import * as bg from "@bgord/ui";
import { use } from "react";
import type { BodyPartMeasurementListResponse } from "../../modules/measurements/queries/list-body-part-measurements";
import * as ui from "../components";
import { BodyPartHistoryRow } from "./body-part-history-row";

export function BodyPartHistory(props: {
  history: Promise<BodyPartMeasurementListResponse>;
  onChange: () => void;
}) {
  const history = use(props.history);

  return history.data.map((measurement, index) => (
    <BodyPartHistoryRow
      first={index === 0}
      key={measurement.id}
      measurement={measurement}
      onChange={props.onChange}
    />
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
