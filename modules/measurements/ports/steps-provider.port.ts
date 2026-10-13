import type * as VO from "+measurements/value-objects";

export interface StepsProviderPort {
  provide(): Promise<VO.StepsCountType>;
}
