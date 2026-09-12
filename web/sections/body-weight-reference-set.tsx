import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import type { BodyWeightMeasurement } from "../../modules/measurements/value-objects/body-weight-measurement";
import { measurementsRoute } from "../router";

export function BodyWeightReferenceSet(props: { measurement: BodyWeightMeasurement }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/body-weight/measurement/${props.measurement.id}/reference`, {
        method: "POST",
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
        data-color={props.measurement.reference ? "brand-400" : "neutral-400"}
        data-hover-color="brand-300"
        data-variant="ghost"
        disabled={props.measurement.reference || mutation.isLoading}
        title={t("measurements.body_weight.reference.title")}
        type="submit"
      >
        <Flag data-size="sm" fill={props.measurement.reference ? "currentColor" : "none"} />
      </button>
    </form>
  );
}
