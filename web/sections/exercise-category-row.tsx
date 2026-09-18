import * as bg from "@bgord/ui";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import * as ui from "../components";
import { ExerciseCategoryDelete } from "./exercise-category-delete";
import { ExerciseCategoryRename } from "./exercise-category-rename";

export function ExerciseCategoryRow(props: ExerciseCategory) {
  const exerciseCategoryRename = bg.useToggle({ name: `exercise-category-rename-${props.id}` });

  return (
    <li
      data-cross="center"
      data-hover-bg={exerciseCategoryRename.off ? "alpha-subtle" : undefined}
      data-main="between"
      data-px={exerciseCategoryRename.off ? "3" : undefined}
      data-stack="x"
      data-wrap="nowrap"
      {...ui.Spacing.rowCompact}
    >
      <ExerciseCategoryRename {...props} {...exerciseCategoryRename} />

      {exerciseCategoryRename.off && <ExerciseCategoryDelete {...props} />}
    </li>
  );
}
