import * as bg from "@bgord/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePinnedExercise } from "../hooks/use-pinned-exercise";

export function WorkoutPinStep(props: { direction: "previous" | "next" }) {
  const t = bg.useTranslations();
  const pinnedExercise = usePinnedExercise();

  const sibling = pinnedExercise[props.direction];

  const title = sibling
    ? t(`workout.pin.${props.direction}.title`, { name: sibling.exerciseName })
    : t(`workout.pin.${props.direction}`);

  return (
    <button
      aria-label={title}
      data-color={sibling ? "neutral-400" : "neutral-700"}
      data-cursor={sibling ? "pointer" : undefined}
      data-hover-color={sibling ? "neutral-0" : undefined}
      data-md-p="1"
      data-p="2-5"
      data-shrink="0"
      data-stack="x"
      disabled={!sibling}
      onClick={() => sibling && pinnedExercise.pin(sibling.id)}
      title={title}
      type="button"
    >
      {props.direction === "previous" ? <ChevronLeft data-size="sm" /> : <ChevronRight data-size="sm" />}
    </button>
  );
}
