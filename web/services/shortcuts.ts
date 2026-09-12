import type { TranslationsKeyType } from "@bgord/ui";

export type ShortcutType = { keys: string; trigger: string; label: TranslationsKeyType };

export const GoToDashboard: ShortcutType = { keys: "g d", trigger: "g d", label: "app.dashboard" };
export const GoToWorkouts: ShortcutType = { keys: "g w", trigger: "g w", label: "app.workouts" };
export const GoToCatalog: ShortcutType = { keys: "g c", trigger: "g c", label: "app.catalog" };
export const GoToPlans: ShortcutType = { keys: "g p", trigger: "g p", label: "app.plans" };
export const GoToMeasurements: ShortcutType = { keys: "g m", trigger: "g m", label: "app.measurements" };
export const ToggleHelp: ShortcutType = { keys: "?", trigger: "[Shift]+?", label: "app.shortcuts.help" };
export const CloseHelp: ShortcutType = { keys: "Esc", trigger: "Escape", label: "app.shortcuts.close" };

export const OpenUpcomingWorkout: ShortcutType = {
  keys: "o",
  trigger: "o",
  label: "dashboard.shortcuts.open",
};

export const ScheduleWorkout: ShortcutType = {
  keys: "n",
  trigger: "n",
  label: "workout.shortcuts.schedule",
};
export const OpenWorkout: ShortcutType = { keys: "o", trigger: "o", label: "workout.shortcuts.open" };

export const SearchExercises: ShortcutType = {
  keys: "/",
  trigger: "/",
  label: "exercise.catalog.shortcuts.search",
};
export const OpenExercise: ShortcutType = {
  keys: "o",
  trigger: "o",
  label: "exercise.catalog.shortcuts.open",
};

export const LogBodyWeight: ShortcutType = {
  keys: "n",
  trigger: "n",
  label: "measurements.body_weight.shortcuts.log",
};

export const GlobalGroup: Array<ShortcutType> = [
  GoToDashboard,
  GoToCatalog,
  GoToPlans,
  GoToMeasurements,
  ToggleHelp,
];

export const DashboardGroup: Array<ShortcutType> = [OpenUpcomingWorkout];

export const WorkoutsGroup: Array<ShortcutType> = [ScheduleWorkout, OpenWorkout];

export const CatalogGroup: Array<ShortcutType> = [SearchExercises, OpenExercise];
