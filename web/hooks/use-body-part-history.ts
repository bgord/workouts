import { startTransition, useEffect, useRef, useState } from "react";
import type { BodyPartMeasurementListResponse } from "../../modules/measurements/queries/list-body-part-measurements";
import { Measurements } from "../api";

export function useBodyPartHistory(bodyPartId: string, latestId: string | undefined) {
  const [history, setHistory] = useState<Promise<BodyPartMeasurementListResponse> | null>(null);
  const seen = useRef(latestId);

  const load = () =>
    setHistory((current) => current ?? Measurements.listBodyPartMeasurements(null, bodyPartId));

  const reload = () =>
    startTransition(() =>
      setHistory((current) => current && Measurements.listBodyPartMeasurements(null, bodyPartId)),
    );

  useEffect(() => {
    if (seen.current === latestId) return;
    seen.current = latestId;
    reload();
  });

  return { history, load, reload };
}
