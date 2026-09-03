import type { Workout } from "+workouts/aggregates";
import type * as VO from "+workouts/value-objects";

export interface WorkoutRepositoryPort {
  load(id: VO.WorkoutIdType): Promise<Workout>;
  save(aggregate: Workout): Promise<void>;
}
