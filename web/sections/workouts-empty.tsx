import * as bg from "@bgord/ui";
import { CalendarOff } from "lucide-react";
import * as ui from "../components";
import { workoutsRoute } from "../router";

export function WorkoutsEmpty() {
  const t = bg.useTranslations();
  const { workouts } = workoutsRoute.useLoaderData();

  if (workouts.data.length > 0) return null;

  return (
    <ui.EmptyState>
      <ui.EmptyStateIcon icon={CalendarOff} />

      <ui.EmptyStateMessage>{t("workout.list.empty")}</ui.EmptyStateMessage>

      <small>{t("workout.list.empty.hint")}</small>

      <ui.EmptyStateLink to="/plans">{t("workout.list.empty.cta")}</ui.EmptyStateLink>
    </ui.EmptyState>
  );
}
