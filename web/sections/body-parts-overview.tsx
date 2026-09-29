import { measurementsRoute } from "../router";
import { BodyPartOverviewRow } from "./body-part-overview-row";

export function BodyPartsOverview() {
  const { bodyParts } = measurementsRoute.useLoaderData();

  if (bodyParts.data.length === 0) return null;

  return (
    <ul className="c-card" data-p="2" data-stack="y">
      {bodyParts.data.map((bodyPart, index) => (
        <BodyPartOverviewRow
          first={index === 0}
          key={`${bodyPart.id}-${bodyPart.latest?.id}`}
          {...bodyPart}
        />
      ))}
    </ul>
  );
}
