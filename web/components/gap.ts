export const Gap = {
  // Text lines in a row body (RowBody, exercise name + sets/reps, StatusPanel label + description),
  // icon + text badges (EyebrowLink, WeightDelta, RirBadge, SetDots, TextLink, ButtonBack),
  // icon-button groups (measurement row, workout exercise row controls), DialogFooter buttons,
  // input + button inline forms (rename, note, description, category add), plan name → description,
  // workout section → plan name
  inline: { "data-gap": "1" },
  // Label + control inside a form field (PlanCreate, ExerciseAdd, WorkoutCreate, ProfileAccountDelete)
  field: { "data-gap": "1-5" },
  // Chip lists (categories, ExerciseCard), card lists (PlanCard, WorkoutHistory), toolbars
  // (filters, search + counter), eyebrow → content (dashboard tiles), sm icon + text
  // (ActionHint, Logo, profile card headings, DialogStatus/DialogError, MenuItem), inline form → Output,
  // StatusPanel dot → text, StatusPanelAction buttons
  cluster: { "data-gap": "2" },
  // Row items (index + image + body + controls), header bars (ButtonBack + Menu),
  // StatusPanel summary → action, h2 → content, card content (profile cards, ExerciseCard, DialogHeader),
  // stats tiles (BodyWeightStats, ExerciseStats), dialog info + status, chart header,
  // DateTile → workout names, workout identity → reschedule form
  related: { "data-gap": "3" },
  // Toolbar → list (WorkoutHistory, ExerciseCatalog, BodyWeightMeasurementList),
  // ExerciseCatalog card grid, exercise page sidebar, shortcuts overlay card, history row metrics,
  // plan header (bar → name + description → StatusPanel),
  // measurements and exercise headers (bar → h1),
  // workout header (bar → identity → StatusPanel → note → reorder strip)
  block: { "data-gap": "4" },
  // Main page sections (Exercise, Measurements), form fields (PlanCreate, ExerciseAdd, WorkoutCreate,
  // BodyWeightMeasurementImport, BodyPartMeasurementImport, exercise instruction add/edit, WorkoutExerciseAdd),
  // desktop nav links
  section: { "data-gap": "6" },
  // Dialog blocks (header → body → form), error → footer in confirmation forms
  stack: { "data-gap": "8" },
} as const;
