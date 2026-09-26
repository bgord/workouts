import type * as VO from "+measurements/value-objects";

export interface GetBodyPart {
  execute(bodyPartId: VO.BodyPartIdType): Promise<VO.BodyPart | null>;
}
