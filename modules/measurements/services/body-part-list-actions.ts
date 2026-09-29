import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type * as Queries from "+measurements/queries";
import type * as VO from "+measurements/value-objects";
import { BodyPartIsDefined } from "../invariants/body-part-is-defined";

type BodyPartListActionsFacts = { active: ReadonlyArray<VO.BodyPart> };

export class BodyPartListActions {
  constructor(private readonly facts: BodyPartListActionsFacts) {}

  calculate(): Queries.BodyPartListResponse["actions"] {
    const activeCount = tools.Int.nonNegative(this.facts.active.length);

    return { measure: bg.ActionState.of(true, [bg.ActionBlocker.from(BodyPartIsDefined, { activeCount })]) };
  }
}
