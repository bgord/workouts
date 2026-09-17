import * as bg from "@bgord/ui";
import type { ExerciseCategory } from "../../modules/exercises/value-objects/exercise-category";
import { catalogRoute } from "../router";
import { ExerciseCategoryDelete } from "./exercise-category-delete";
import { ExerciseCategoryRename } from "./exercise-category-rename";

export function ExerciseCategoryRow(props: ExerciseCategory) {
  const { exerciseCategories } = catalogRoute.useLoaderData();

  const exerciseCategoryRename = bg.useToggle({ name: `exercise-category-rename-${props.id}` });

  return (
    <li
      data-bc="neutral-800"
      data-cross="center"
      data-gap="3"
      data-hover-bg={exerciseCategoryRename.off ? "alpha-subtle" : undefined}
      data-main="between"
      data-px={exerciseCategoryRename.off ? "3" : "0"}
      data-py="1-5"
      data-stack="x"
      data-wrap="nowrap"
    >
      {exerciseCategories.actions.rename.available ? (
        <ExerciseCategoryRename {...props} {...exerciseCategoryRename} />
      ) : (
        <div data-fs="sm">{props.name}</div>
      )}

      {exerciseCategories.actions.delete.available && exerciseCategoryRename.off && (
        <ExerciseCategoryDelete {...props} />
      )}
    </li>
  );
}
