import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { BodyPartMeasurement } from "../../modules/measurements/value-objects/body-part-measurement";
import * as ui from "../components";
import { measurementsRoute } from "../router";

export function BodyPartMeasurementRemove(props: {
  measurement: BodyPartMeasurement;
  onSuccess: () => void;
}) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-part/measurement/${props.measurement.id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: async () => {
      await router.invalidate({ filter: (match) => match.routeId === measurementsRoute.id, sync: true });
      props.onSuccess();
    },
  });

  return (
    <form aria-busy={mutation.isLoading} data-stack="x" onSubmit={mutation.handleSubmit}>
      <ui.IconButton
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
