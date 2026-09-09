import type * as VO from "+stats/value-objects";

class ExerciseRecordOrderFactory {
  compare(one: VO.ExerciseRecord, another: VO.ExerciseRecord): number {
    return another.load - one.load || another.reps - one.reps || one.completedAt - another.completedAt;
  }
}

export const ExerciseRecordOrder = new ExerciseRecordOrderFactory();
