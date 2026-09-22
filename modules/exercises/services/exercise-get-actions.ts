import type * as tools from "@bgord/tools";
import { ActionBlocker, ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as Queries from "+exercises/queries";
import type * as VO from "+exercises/value-objects";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";
import { ExerciseCategoryLimit } from "../invariants/exercise-category-limit";
import { ExerciseIsNotUsed } from "../invariants/exercise-is-not-used";

type ExerciseGetActionsFacts = {
  requesterId: Auth.VO.UserIdType;
  usageCount: tools.IntegerNonNegativeType;
  categories: ReadonlyArray<VO.ExerciseCategory>;
  assignableCategories: ReadonlyArray<VO.ExerciseCategory>;
};

export class ExerciseGetActions {
  constructor(private readonly facts: ExerciseGetActionsFacts) {}

  calculate(): Queries.ExerciseGetResponse["actions"] {
    const managed = CatalogIsManagedByAdmin.passes({ requesterId: this.facts.requesterId });

    return {
      update: ActionState.of(managed),
      imageChange: ActionState.of(managed),
      delete: ActionState.of(managed, [
        ActionBlocker.from(ExerciseIsNotUsed, { count: this.facts.usageCount }),
      ]),
      categoryAssign: ActionState.of(managed, [
        ActionBlocker.from(ExerciseCategoryLimit, { exerciseCategories: this.facts.categories }),
        {
          passes: this.facts.assignableCategories.length > 0,
          hint: "exercise.category.assign.blocked.none_left",
        },
      ]),
      categoryUnassign: ActionState.of(managed),
    };
  }
}
