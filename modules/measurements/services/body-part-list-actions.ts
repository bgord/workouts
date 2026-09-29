import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Queries from "+measurements/queries";
import type * as VO from "+measurements/value-objects";
import { BodyPartIsActive } from "../invariants/body-part-is-active";
import { BodyPartIsDefined } from "../invariants/body-part-is-defined";

type BodyPartListActionsFacts = { bodyParts: ReadonlyArray<Pick<VO.BodyPart, "archivedAt">> };

export class BodyPartListActions {
  constructor(private readonly facts: BodyPartListActionsFacts) {}

  calculate(): Queries.BodyPartListResponse["actions"] {
    const activeCount = tools.Int.nonNegative(
      this.facts.bodyParts.filter((bodyPart) => BodyPartIsActive.passes({ archivedAt: bodyPart.archivedAt }))
        .length,
    );

    return { measure: bg.ActionState.of(true, [bg.ActionBlocker.from(BodyPartIsDefined, { activeCount })]) };
  }
}
