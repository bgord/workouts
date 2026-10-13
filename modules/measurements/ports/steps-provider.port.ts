import type * as VO from "+measurements/value-objects";

export interface StepsProviderPort {
  readonly source: VO.StepsSourceType;
  provide(): Promise<VO.StepsCountType>;
}
