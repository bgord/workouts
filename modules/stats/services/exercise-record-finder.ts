import type * as VO from "+stats/value-objects";

export class ExerciseRecordFinder {
  find(sessions: ReadonlyArray<VO.ExerciseSession>): VO.ExerciseRecord | undefined {
    const [record] = sessions
      .flatMap((session) =>
        session.sets.map((set) => ({
          reps: set.reps,
          load: set.load,
          workoutId: session.workoutId,
          completedAt: session.completedAt,
        })),
      )
      .toSorted(
        (one, another) =>
          another.load - one.load || another.reps - one.reps || one.completedAt - another.completedAt,
      );

    return record;
  }
}
