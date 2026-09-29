import { useState } from "react";
import type { BodyPartMeasurementListResponse } from "../../modules/measurements/queries/list-body-part-measurements";
import { Measurements } from "../api";

export function useBodyPartHistory(bodyPartId: string) {
  const [history, setHistory] = useState<Promise<BodyPartMeasurementListResponse> | null>(null);

  const load = () =>
    setHistory((current) => current ?? Measurements.listBodyPartMeasurements(null, bodyPartId));

  return { history, load };
}
