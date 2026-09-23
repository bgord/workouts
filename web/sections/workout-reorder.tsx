import * as bg from "@bgord/ui";
import { ArrowUpDown, Check } from "lucide-react";
import * as ui from "../components";
import { workoutRoute } from "../router";

export function WorkoutReorder(props: ReturnType<typeof bg.useToggle>) {
  const t = bg.useTranslations();
  const { workout } = workoutRoute.useLoaderData();

  if (!workout.actions.reorder.available) return null;

  const title = props.on
    ? t("workout.exercise.reorder.stop.title")
    : t("workout.exercise.reorder.start.title");

  return (
    <ui.IconButton
      aria-label={title}
      aria-pressed={props.on}
      onClick={props.toggle}
      title={title}
      tone={props.on ? "brand" : "neutral"}
    >
      {props.on ? <Check data-size="sm" /> : <ArrowUpDown data-size="sm" />}
    </ui.IconButton>
  );
}
