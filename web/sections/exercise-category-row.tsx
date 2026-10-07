import * as bg from "@bgord/ui";
import type { ExerciseCategoryWithExerciseNames } from "../../modules/exercises/value-objects/exercise-category-with-exercise-names";
import * as ui from "../components";
import { ExerciseCategoryDelete } from "./exercise-category-delete";
import { ExerciseCategoryRename } from "./exercise-category-rename";

export function ExerciseCategoryRow(props: ExerciseCategoryWithExerciseNames & { first: boolean }) {
  const t = bg.useTranslations();
  const { first, exerciseNames, ...category } = props;
  const exerciseCategoryRename = bg.useToggle({ name: `exercise-category-rename-${props.id}` });

  const hidden = exerciseNames.length - 2;

  return (
    <ui.HairlineRow
      aria-label={props.name}
      data-hover-bg={exerciseCategoryRename.off ? "alpha-subtle" : undefined}
      data-px={exerciseCategoryRename.off ? "3" : undefined}
      data-stack="x"
      first={first}
      tone="subtle"
      {...ui.Spacing.rowCompact}
    >
      {exerciseCategoryRename.off && (
        <ui.RowBody>
          <span data-color="neutral-100" data-transform="truncate">
            {props.name}
          </span>

          {exerciseNames.length === 0 && (
            <span data-color="neutral-500" data-fs="xs">
              {t("exercise.category.exercises.empty")}
            </span>
          )}

          {exerciseNames.length > 0 && (
            <span data-color="neutral-500" data-fs="xs" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
              <span data-transform="truncate">{exerciseNames.slice(0, 2).join(", ")}</span>

              {hidden > 0 && (
                <span data-color="neutral-400" data-shrink="0">
                  +{hidden}
                </span>
              )}
            </span>
          )}
        </ui.RowBody>
      )}

      <ExerciseCategoryRename {...category} {...exerciseCategoryRename} />

      {exerciseCategoryRename.off && <ExerciseCategoryDelete {...category} />}
    </ui.HairlineRow>
  );
}
