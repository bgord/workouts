import { measurementsRoute } from "../router";
import { BodyPartOverviewRow } from "./body-part-overview-row";

export function BodyPartsOverview() {
  const { bodyParts } = measurementsRoute.useLoaderData();

  if (bodyParts.data.length === 0) return null;

  return (
    <ul data-stack="y">
      {bodyParts.data.map((bodyPart, index) => (
        <BodyPartOverviewRow first={index === 0} key={bodyPart.id} {...bodyPart} />
      ))}
    </ul>
  );
}
