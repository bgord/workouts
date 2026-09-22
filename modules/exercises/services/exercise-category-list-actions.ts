import { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as Queries from "+exercises/queries";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";

type ExerciseCategoryListActionsFacts = { requesterId: Auth.VO.UserIdType };

export class ExerciseCategoryListActions {
  constructor(private readonly facts: ExerciseCategoryListActionsFacts) {}

  calculate(): Queries.ExerciseCategoryListResponse["actions"] {
    const managed = CatalogIsManagedByAdmin.passes({ requesterId: this.facts.requesterId });

    return {
      manage: ActionState.of(managed),
      add: ActionState.of(managed),
      rename: ActionState.of(managed),
      delete: ActionState.of(managed),
    };
  }
}
