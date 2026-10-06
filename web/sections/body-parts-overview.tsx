import * as bg from "@bgord/ui";
import { bodyPartsRoute } from "../router";
import { BodyPartOverviewRow } from "./body-part-overview-row";

export function BodyPartsOverview() {
  const t = bg.useTranslations();
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  if (bodyParts.data.length === 0) return null;

  return (
    <>
      <h2>{t("measurements.body_parts.latest")}</h2>

      <ul data-stack="y">
        {bodyParts.data.map((bodyPart, index) => (
          <BodyPartOverviewRow first={index === 0} key={bodyPart.id} {...bodyPart} />
        ))}
      </ul>
    </>
  );
}
