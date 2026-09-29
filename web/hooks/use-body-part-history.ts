import { startTransition, useEffect, useState } from "react";
import type { BodyPartMeasurementListResponse } from "../../modules/measurements/queries/list-body-part-measurements";
import { Measurements } from "../api";
import { bodyPartsRoute } from "../router";

export function useBodyPartHistory(bodyPartId: string) {
  const [history, setHistory] = useState<Promise<BodyPartMeasurementListResponse> | null>(null);
  const loadedAt = bodyPartsRoute.useMatch({ select: (match) => match.updatedAt });

  const load = () =>
    setHistory((current) => current ?? Measurements.listBodyPartMeasurements(null, bodyPartId));

  useEffect(() => {
    startTransition(() =>
      setHistory((current) => current && Measurements.listBodyPartMeasurements(null, bodyPartId)),
    );
  }, [loadedAt, bodyPartId]);

  return { history, load };
}
