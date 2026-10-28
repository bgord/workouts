import type { GetWorkoutDashboard } from "+workouts/queries/get-workout-dashboard";
import type {
  ExercisePerformance,
  ListExercisePerformances,
} from "+workouts/queries/list-exercise-performances";
import type {
  ListWeekCompletedWorkouts,
  WeekCompletedWorkout,
} from "+workouts/queries/list-week-completed-workouts";

export { LoggedSetsVolume } from "+workouts/services/logged-sets-volume";

export type GetWorkoutDashboardOHQ = GetWorkoutDashboard;
export type ListExercisePerformancesOHQ = ListExercisePerformances;
export type ExercisePerformanceOHQ = ExercisePerformance;
export type ListWeekCompletedWorkoutsOHQ = ListWeekCompletedWorkouts;
export type WeekCompletedWorkoutOHQ = WeekCompletedWorkout;
