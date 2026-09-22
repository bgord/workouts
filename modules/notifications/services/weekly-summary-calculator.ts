import * as tools from "@bgord/tools";
import * as v from "valibot";
import type * as Measurements from "+measurements";
import * as Workouts from "+workouts";
import type * as VO from "+notifications/value-objects";

type Config = {
  week: tools.Week;
  workouts: ReadonlyArray<Workouts.Queries.WeekCompletedWorkout>;
  previousWorkouts: ReadonlyArray<Workouts.Queries.WeekCompletedWorkout>;
  performances: ReadonlyArray<Workouts.Queries.WeekExercisePerformance>;
  measurements: ReadonlyArray<Measurements.VO.BodyWeightMeasurement>;
  completed: Workouts.Queries.WorkoutDashboardCompleted;
};

const numbers = (workouts: ReadonlyArray<Workouts.Queries.WeekCompletedWorkout>): VO.WeeklySummaryNumbers => {
  const sets = workouts.flatMap((workout) => workout.sets);

  return {
    workouts: tools.Int.nonNegative(workouts.length),
    sets: tools.Int.nonNegative(sets.length),
    volume: v.parse(
      tools.WeightGrams,
      sets.reduce((total, set) => total + set.reps * set.load, 0),
    ),
  };
};

const average = (measurements: ReadonlyArray<Measurements.VO.BodyWeightMeasurement>) =>
  measurements.reduce((sum, measurement) => sum + measurement.weight, 0) / measurements.length;

const within = (week: tools.Week) => {
  const start = tools.Day.fromTimestamp(week.getStart()).toIsoId();
  const end = tools.Day.fromTimestamp(week.getEnd()).toIsoId();

  return (day: tools.DayIsoIdType) => day >= start && day <= end;
};

export class WeeklySummaryCalculator {
  constructor(private readonly config: Config) {}

  calculate(): VO.WeeklySummary | null {
    const current = numbers(this.config.workouts);
    const bodyWeight = this.bodyWeight();

    if (current.workouts === 0 && !bodyWeight) return null;

    const previous = numbers(this.config.previousWorkouts);

    return {
      weekIsoId: this.config.week.toIsoId(),
      numbers: {
        current,
        previous,
        delta: {
          workouts: v.parse(tools.Integer, current.workouts - previous.workouts),
          sets: v.parse(tools.Integer, current.sets - previous.sets),
          volume: v.parse(tools.Integer, current.volume - previous.volume),
        },
      },
      highlights: this.highlights(),
      bodyWeight,
      completed: this.config.completed,
    };
  }

  private highlights(): Array<VO.WeeklySummaryHighlight> {
    return this.config.performances.flatMap((performance) => {
      if (!performance.previous) return [];

      const previous = new Workouts.Services.ExercisePerformanceWeakestSet(performance.previous).calculate();
      const current = new Workouts.Services.ExercisePerformanceWeakestSet(performance.current).calculate();

      const loadUp = current.load > previous.load;
      const repsUp = current.load === previous.load && current.reps > previous.reps;

      if (!(loadUp || repsUp)) return [];

      return [
        { exerciseId: performance.exerciseId, exerciseName: performance.exerciseName, previous, current },
      ];
    });
  }

  private bodyWeight(): VO.WeeklySummaryBodyWeight | undefined {
    const inWeek = this.config.measurements.filter((measurement) =>
      within(this.config.week)(measurement.measuredOn),
    );

    if (inWeek.length === 0) return undefined;

    const inPreviousWeek = this.config.measurements.filter((measurement) =>
      within(this.config.week.previous())(measurement.measuredOn),
    );

    return {
      average: average(inWeek),
      count: tools.Int.positive(inWeek.length),
      previousAverage: inPreviousWeek.length > 0 ? average(inPreviousWeek) : undefined,
      goal: this.config.measurements.find((measurement) => measurement.reference)?.goal,
    };
  }
}
