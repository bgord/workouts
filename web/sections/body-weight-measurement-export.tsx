// fallow-ignore-file unused-export
import * as bg from "@bgord/ui";
import { Download } from "lucide-react";
import { measurementsRoute } from "../router";

export function BodyWeightMeasurementExport() {
  const { measurements } = measurementsRoute.useLoaderData();

  if (measurements.length === 0) return null;

  return (
    <a
      className="c-button"
      data-color="neutral-400"
      data-hover-color="neutral-0"
      data-px="0"
      data-variant="ghost"
      download
      href="/api/measurements/body-weight/export"
      rel="noopener"
      target="_blank"
      {...bg.Rhythm().times(3).style.width}
    >
      <Download data-size="sm" />
    </a>
  );
}
