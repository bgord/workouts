import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import * as ui from "../components";
import { measurementsRoute } from "../router";

export function BodyWeightMeasurementRemove(props: { measurement: BodyWeightMeasurement }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-weight/measurement/${props.measurement.id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () =>
      router.invalidate({ filter: (match) => match.routeId === measurementsRoute.id, sync: true }),
  });

  return (
    <form aria-busy={mutation.isLoading} data-stack="x" onSubmit={mutation.handleSubmit}>
      <ui.IconButton
        disabled={mutation.isLoading}
        title={t("measurements.body_weight.remove.title")}
        tone="danger"
        type="submit"
      >
        <X data-size="sm" />
      </ui.IconButton>
    </form>
  );
}
