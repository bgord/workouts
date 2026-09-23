import * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as Queries from "+exercises/queries";
import { CatalogIsManagedByAdmin } from "../invariants/catalog-is-managed-by-admin";

type ExerciseListActionsFacts = { requesterId: Auth.VO.UserIdType };

export class ExerciseListActions {
  constructor(private readonly facts: ExerciseListActionsFacts) {}

  calculate(): Queries.ExerciseListResponse["actions"] {
    return {
      add: bg.ActionState.of(CatalogIsManagedByAdmin.passes({ requesterId: this.facts.requesterId })),
    };
  }
}
