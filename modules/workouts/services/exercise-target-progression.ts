import type * as VO from "+workouts/value-objects";

export class ExerciseTargetProgression {
  constructor(
    private readonly previous: VO.ExerciseTargetType,
    private readonly current: VO.ExerciseTargetType,
  ) {}

  happened(): boolean {
    const loadUp = this.current.load > this.previous.load;
    const repsUp = this.current.load === this.previous.load && this.current.reps > this.previous.reps;

    return loadUp || repsUp;
  }
}
