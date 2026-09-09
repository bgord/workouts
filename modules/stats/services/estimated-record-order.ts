import type * as VO from "+stats/value-objects";

class EstimatedRecordOrderFactory {
  compare(one: VO.EstimatedRecord, another: VO.EstimatedRecord): number {
    return another.oneRepMaxEstimate - one.oneRepMaxEstimate || one.completedAt - another.completedAt;
  }
}

export const EstimatedRecordOrder = new EstimatedRecordOrderFactory();
