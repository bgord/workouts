import * as bg from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { X } from "lucide-react";
import type { DailySteps } from "../../modules/measurements/value-objects/daily-steps";
import * as ui from "../components";
import { dailyStepsRoute } from "../router";

export function DailyStepsRemove(props: { entry: DailySteps }) {
  const t = bg.useTranslations();
  const router = useRouter();

  const mutation = bg.useMutation({
    perform: () =>
      fetch(`/api/measurements/daily-steps/${props.entry.day}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () =>
      router.invalidate({ filter: (match) => match.routeId === dailyStepsRoute.id, sync: true }),
  });

  return (
    <form aria-busy={mutation.isLoading} data-stack="x" onSubmit={mutation.handleSubmit}>
      <ui.IconButton
        aria-label={t("measurements.daily_steps.remove.title")}
        disabled={mutation.isLoading}
        title={t("measurements.daily_steps.remove.title")}
        tone="danger"
        type="submit"
      >
        <X data-size="sm" />
      </ui.IconButton>
    </form>
  );
}
