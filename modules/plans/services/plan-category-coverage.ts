import * as Exercises from "+exercises";
import type * as VO from "+plans/value-objects";

type PlanCategoryCoverageFacts = {
  categories: ReadonlyArray<Exercises.VO.ExerciseCategory>;
  instructions: ReadonlyArray<{
    sets: VO.SetsType;
    categories: ReadonlyArray<Exercises.VO.ExerciseCategoryAssignment>;
  }>;
};

export class PlanCategoryCoverage {
  constructor(private readonly facts: PlanCategoryCoverageFacts) {}

  calculate(): VO.PlanCategoryCoverage {
    return this.facts.categories
      .map((category) => {
        const sets = {
          [Exercises.VO.ExerciseCategoryRoleOptions.primary]: 0,
          [Exercises.VO.ExerciseCategoryRoleOptions.secondary]: 0,
        };

        for (const instruction of this.facts.instructions) {
          for (const assignment of instruction.categories) {
            if (assignment.id === category.id) sets[assignment.role] += instruction.sets;
          }
        }

        return {
          category,
          primarySets: sets[Exercises.VO.ExerciseCategoryRoleOptions.primary],
          secondarySets: sets[Exercises.VO.ExerciseCategoryRoleOptions.secondary],
          total: Exercises.VO.ExerciseCategoryRoleWeight.total(sets),
        };
      })
      .toSorted((a, b) => b.total - a.total);
  }
}
