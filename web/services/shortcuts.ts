import type { TranslationsKeyType } from "@bgord/ui";

export type ShortcutType = { keys: string; trigger: string; label: TranslationsKeyType };

export const GoToWorkouts: ShortcutType = { keys: "g w", trigger: "g w", label: "app.workouts" };
export const GoToCatalog: ShortcutType = { keys: "g c", trigger: "g c", label: "app.catalog" };
export const GoToPlans: ShortcutType = { keys: "g p", trigger: "g p", label: "app.plans" };
export const ToggleHelp: ShortcutType = { keys: "?", trigger: "[Shift]+?", label: "app.shortcuts.help" };
export const CloseHelp: ShortcutType = { keys: "Esc", trigger: "Escape", label: "app.shortcuts.close" };

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

export const Global: Array<ShortcutType> = [GoToWorkouts, GoToCatalog, GoToPlans, ToggleHelp];

export const Workouts: Array<ShortcutType> = [ScheduleWorkout, OpenWorkout];

export const Catalog: Array<ShortcutType> = [SearchExercises, OpenExercise];
