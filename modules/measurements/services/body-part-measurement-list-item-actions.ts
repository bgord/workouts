import * as bg from "@bgord/bun";
import type * as Queries from "+measurements/queries";
import type * as VO from "+measurements/value-objects";
import { BodyPartIsActive } from "../invariants/body-part-is-active";

type BodyPartMeasurementListItemActionsFacts = { bodyPart: Pick<VO.BodyPart, "archivedAt"> };

export class BodyPartMeasurementListItemActions {
  constructor(private readonly facts: BodyPartMeasurementListItemActionsFacts) {}

  calculate(): Queries.BodyPartMeasurementActions {
    const active = BodyPartIsActive.passes({ archivedAt: this.facts.bodyPart.archivedAt });

    return { correct: bg.ActionState.of(active) };
  }
}
