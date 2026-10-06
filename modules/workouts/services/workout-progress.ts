import * as tools from "@bgord/tools";
import type * as Queries from "+workouts/queries";
import type * as VO from "+workouts/value-objects";

type WorkoutProgressFacts = {
  exercises: ReadonlyArray<{ id: VO.WorkoutExerciseIdType; loggedSets: ReadonlyArray<unknown> }>;
};

export class WorkoutProgress {
  constructor(private readonly facts: WorkoutProgressFacts) {}

  calculate(): Queries.WorkoutGetResponse["progress"] {
    const logged = this.facts.exercises.filter((exercise) => exercise.loggedSets.length > 0);
    const next =
      this.facts.exercises.find((exercise) => exercise.loggedSets.length === 0) ??
      this.facts.exercises.at(-1);

    return {
      logged: tools.Int.nonNegative(logged.length),
      total: tools.Int.nonNegative(this.facts.exercises.length),
      next: next?.id ?? null,
    };
  }
}
