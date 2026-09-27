import type * as VO from "+measurements/value-objects";

export interface GetBodyPart {
  execute(id: VO.BodyPartIdType): Promise<VO.BodyPart | null>;
}
