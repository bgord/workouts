import * as bg from "@bgord/bun";
import type * as Queries from "+measurements/queries";
import type * as VO from "+measurements/value-objects";
import { BodyPartIsActive } from "../invariants/body-part-is-active";

type BodyPartListItemActionsFacts = Pick<VO.BodyPart, "archivedAt">;

export class BodyPartListItemActions {
  constructor(private readonly facts: BodyPartListItemActionsFacts) {}

  calculate(): Queries.BodyPartActions {
    const active = BodyPartIsActive.passes({ archivedAt: this.facts.archivedAt });

    return { rename: bg.ActionState.of(active), archive: bg.ActionState.of(active) };
  }
}
