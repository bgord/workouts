import * as Exercises from "+exercises";
import { languages } from "+languages";
import * as Preferences from "+preferences";
import type { BootstrapType } from "+infra/bootstrap";
import type { EnvironmentResultType } from "+infra/env";
import * as Projections from "+infra/projections";

export function registerEventHandlers(_Env: EnvironmentResultType, { Adapters, Tools }: BootstrapType) {
  const deps = { ...Adapters.System, ...Tools };

  // Projections
  new Projections.PreferencesProjector(deps);
  new Projections.ProfileAvatarsProjector(deps);
  new Projections.ExercisesProjector(deps);
  new Projections.ExerciseCategoriesProjector(deps);
  new Projections.ExerciseCategoryAssignmentsProjector(deps);
  new Projections.PlansProjector(deps);
  new Projections.PlanSectionsProjector(deps);
  new Projections.PlanSectionExerciseInstructionProjector(deps);
  new Projections.WorkoutsProjector(deps);
  new Projections.WorkoutExercisesProjector(deps);
  new Projections.WorkoutLoggedSetsProjector(deps);

  // Policies
  new Preferences.Policies.SetDefaultUserLanguage(languages.fallback, deps);
  new Preferences.Policies.ProfileAvatarEraser(deps);
  new Exercises.Policies.ExerciseDeleter(deps);
}
