import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+measurements/value-objects";

export type BodyPartMeasurementActions = { correct: bg.ActionState };

export type BodyPartMeasurementListItem = VO.BodyPartMeasurement & { actions: BodyPartMeasurementActions };

export type BodyPartMeasurementListResponse = { data: ReadonlyArray<BodyPartMeasurementListItem> };

export interface ListBodyPartMeasurements {
  execute(userId: Auth.VO.UserIdType): Promise<BodyPartMeasurementListResponse>;
}
