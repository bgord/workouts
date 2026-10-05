import type { BootstrapType } from "+infra/bootstrap";
import * as Projections from "+infra/projections";

export function registerProjectors({ Adapters, Tools }: Pick<BootstrapType, "Adapters" | "Tools">) {
  const deps = { ...Adapters.System, ...Tools };

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
  new Projections.BodyPartMeasurementsProjector(deps);
  new Projections.BodyPartsProjector(deps);
  new Projections.BodyWeightMeasurementsProjector(deps);
  new Projections.WeeklySummariesProjector(deps);
}
