import { Ruler } from "lucide-react";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartsEmpty() {
  const { bodyParts } = bodyPartsRoute.useLoaderData();

  if (bodyParts.actions.import.enabled) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={Ruler} />

      <ui.ActionHint {...bodyParts.actions.import} data-color="neutral-300" data-mt="2" />
    </ui.EmptyState>
  );
}
