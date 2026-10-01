import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { BodyPartSummaryMeasurement } from "../../modules/measurements/value-objects/body-part-summary";
import * as ui from "../components";
import { bodyPartsRoute } from "../router";

export function BodyPartMeasurementRemove(props: { measurement: BodyPartSummaryMeasurement }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/measurement/${props.measurement.id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () =>
      router.invalidate({ filter: (match) => match.routeId === bodyPartsRoute.id, sync: true }),
  });

  return (
    <form aria-busy={mutation.isLoading} data-stack="x" onSubmit={mutation.handleSubmit}>
      <ui.IconButton
        aria-label={t("measurements.body_parts.remove.title")}
        disabled={mutation.isLoading}
        title={t("measurements.body_parts.remove.title")}
        tone="danger"
        type="submit"
      >
        <X data-size="sm" />
      </ui.IconButton>
    </form>
  );
}
