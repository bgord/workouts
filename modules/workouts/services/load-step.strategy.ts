import type * as VO from "+workouts/value-objects";

export interface LoadStepStrategy {
  increase(load: VO.LoadType): VO.LoadType | undefined;
  decrease(load: VO.LoadType): VO.LoadType | undefined;
}
