import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { Ruler, Scale } from "lucide-react";
import { MeasurementsTabOptions } from "../../app/services/measurements-tab-form";
import { measurementsRoute } from "../router";

export function MeasurementsTabs() {
  const t = bg.useTranslations();
  const search = measurementsRoute.useSearch();

  const bodyParts = search.tab === MeasurementsTabOptions.body_parts;

  return (
    <nav data-segmented role="tablist">
      <Link aria-selected={!bodyParts} role="tab" search={{}} to="/measurements">
        <Scale data-size="sm" />
        {t("measurements.body_weight.header")}
      </Link>

      <Link
        aria-selected={bodyParts}
        role="tab"
        search={{ tab: MeasurementsTabOptions.body_parts }}
        to="/measurements"
      >
        <Ruler data-size="sm" />
        {t("measurements.body_parts.header")}
      </Link>
    </nav>
  );
}
