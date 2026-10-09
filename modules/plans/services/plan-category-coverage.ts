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
    const entries = this.facts.categories.map((category) => {
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
    });

    const max = Math.max(0, ...entries.map((entry) => entry.total));

    return entries
      .map((entry) => ({
        ...entry,
        primaryShare: this.share(entry.primarySets, Exercises.VO.ExerciseCategoryRoleOptions.primary, max),
        secondaryShare: this.share(
          entry.secondarySets,
          Exercises.VO.ExerciseCategoryRoleOptions.secondary,
          max,
        ),
      }))
      .toSorted((a, b) => b.total - a.total);
  }

  private share(sets: number, role: Exercises.VO.ExerciseCategoryRoleOptions, max: number): number {
    return max === 0 ? 0 : (sets * Exercises.VO.ExerciseCategoryRoleWeight.of(role)) / max;
  }
}
