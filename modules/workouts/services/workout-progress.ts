import * as tools from "@bgord/tools";
import type * as Queries from "+workouts/queries";

type WorkoutProgressFacts = { exercises: ReadonlyArray<{ loggedSets: ReadonlyArray<unknown> }> };

export class WorkoutProgress {
  constructor(private readonly facts: WorkoutProgressFacts) {}

  calculate(): Queries.WorkoutGetResponse["progress"] {
    const logged = this.facts.exercises.filter((exercise) => exercise.loggedSets.length > 0);

    return {
      logged: tools.Int.nonNegative(logged.length),
      total: tools.Int.nonNegative(this.facts.exercises.length),
    };
  }
}
