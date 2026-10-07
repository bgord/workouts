import * as bg from "@bgord/ui";
import { ArrowLeftRight } from "lucide-react";
import type { Exercise } from "../../modules/exercises/value-objects/exercise";
import type { ExerciseWithCategories } from "../../modules/exercises/value-objects/exercise-with-categories";
import { ResistanceKit } from "../kits/resistance.kit";
import { ExerciseImage, ExerciseImageSize } from "./exercise-image";
import { Gap } from "./gap";
import { IconButton } from "./icon-button";
import { Spacing } from "./spacing";

export function ExercisePicked(
  props: Omit<React.JSX.IntrinsicElements["button"], "onChange"> & {
    exercise: Exercise & Partial<Pick<ExerciseWithCategories, "categories">>;
    onChange: () => void;
  },
) {
  const t = bg.useTranslations();
  const { exercise, onChange, ...button } = props;
  const Resistance = ResistanceKit[exercise.resistance];

  return (
    <div
      data-bc="alpha-medium"
      data-br="md"
      data-bs="solid"
      data-bw="hairline"
      data-stack="x"
      {...Spacing.surfaceCompact}
      {...Gap.related}
    >
      <span aria-hidden data-shrink="0" data-stack="x">
        <ExerciseImage size={ExerciseImageSize.xs} {...exercise} />
      </span>

      <div data-grow="1" data-minw="0" data-stack="y" {...Gap.inline}>
        <span data-color="neutral-100" data-fw="medium" data-transform="truncate" title={exercise.name}>
          {exercise.name}
        </span>

        <div data-color="neutral-500" data-fs="xs" data-stack="x" data-wrap="wrap" {...Gap.cluster}>
          {exercise.categories && exercise.categories.length > 0 && (
            <span>{exercise.categories.map((category) => category.name).join(", ")}</span>
          )}

          <Resistance.Badge />
        </div>
      </div>

      <IconButton
        aria-label={t("plan.section.exercise.edit.change", { name: exercise.name })}
        data-shrink="0"
        onClick={onChange}
        title={t("plan.section.exercise.edit.change", { name: exercise.name })}
        {...button}
      >
        <ArrowLeftRight data-size="sm" />
      </IconButton>
    </div>
  );
}
