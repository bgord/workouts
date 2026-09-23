import type * as tools from "@bgord/tools";
import * as bg from "@bgord/bun";
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
      update: bg.ActionState.of(managed),
      imageChange: bg.ActionState.of(managed),
      delete: bg.ActionState.of(managed, [
        bg.ActionBlocker.from(ExerciseIsNotUsed, { count: this.facts.usageCount }),
      ]),
      categoryAssign: bg.ActionState.of(managed, [
        bg.ActionBlocker.from(ExerciseCategoryLimit, { exerciseCategories: this.facts.categories }),
        {
          passes: this.facts.assignableCategories.length > 0,
          hint: "exercise.category.assign.blocked.none_left",
        },
      ]),
      categoryUnassign: bg.ActionState.of(managed),
    };
  }
}
