import * as bg from "@bgord/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as ui from "../components";
import { usePinnedExercise } from "../hooks/use-pinned-exercise";

export function WorkoutPinStep(props: { direction: "previous" | "next" }) {
  const t = bg.useTranslations();
  const pinnedExercise = usePinnedExercise();

  const sibling = pinnedExercise[props.direction];

  const title = sibling
    ? t(`workout.pin.${props.direction}.title`, { name: sibling.exerciseName })
    : t(`workout.pin.${props.direction}`);

  return (
    <ui.IconButton
      aria-label={title}
      disabled={!sibling}
      onClick={() => sibling && pinnedExercise.pin(sibling.id)}
      title={title}
    >
      {props.direction === "previous" ? <ChevronLeft data-size="sm" /> : <ChevronRight data-size="sm" />}
    </ui.IconButton>
  );
}
