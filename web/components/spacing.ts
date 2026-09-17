import { Gap } from "./gap";

export const Spacing = {
  // Viewport side padding: Main, NavigationDesktop inner, NavigationMobileDrawer, Shortcuts overlay
  gutter: { "data-md-px": "2", "data-px": "3" },
  // EmptyState, ExerciseCategoryManage empty list
  empty: { ...Gap.inline, "data-px": "4", "data-py": "8" },
  // Top-level hairline rows: WorkoutExerciseRow, ExerciseHistory row, PlanSectionItem,
  // PlanSectionList add block, WorkoutExerciseAdd
  row: { ...Gap.cluster, "data-py": "4" },
  // Nested hairline rows: WorkoutSetRow, WorkoutSetLog, ExerciseHistory sets,
  // PlanSectionExerciseInstructionRow/Add/Edit, ExerciseCategoryRow, BodyWeightMeasurementRow,
  // ExercisePicker options
  rowCompact: { ...Gap.related, "data-py": "2" },
  // Nested content under a row header: Workout/Plan detail meta, WorkoutExerciseRow description,
  // target and set list, PlanSectionItem instructions, ExerciseHistory sets
  inset: { "data-md-pl": "0", "data-pl": "12" },
  // Cards and panels: profile cards, RowLink, DashboardCompleted list, dropzones
  // (ExerciseAdd, BodyWeightMeasurementImport), ExercisePicker empty option
  surface: { "data-p": "4" },
  // Dense cards: ExerciseCard, WorkoutCreate section option, OnlineStatusBar
  surfaceCompact: { "data-p": "3" },
} as const;
