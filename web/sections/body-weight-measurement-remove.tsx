import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
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
    onSuccess: () => router.invalidate({ filter: (route) => route.id === measurementsRoute.id, sync: true }),
  });

  return (
    <form
      data-cross="center"
      data-self="start"
      data-stack="x"
      data-wrap="nowrap"
      onSubmit={mutation.handleSubmit}
    >
      <button
        className="c-button"
        data-color="neutral-400"
        data-hover-color="danger-400"
        data-variant="ghost"
        disabled={mutation.isLoading}
        title={t("measurements.body_weight.remove.title")}
        type="submit"
      >
        <X data-size="sm" />
      </button>
    </form>
  );
}
