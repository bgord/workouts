import type * as tools from "@bgord/tools";
import type * as Exercises from "+exercises";
import type * as Queries from "+plans/queries";
import * as VO from "+plans/value-objects";
import { PlanCategoryCoverage } from "./plan-category-coverage";
import { PlanGetActions } from "./plan-get-actions";
import { PlanGetExerciseInstructionActions } from "./plan-get-exercise-instruction-actions";
import { PlanGetSectionActions } from "./plan-get-section-actions";

type PlanGetViewExerciseInstruction = Omit<VO.ExerciseInstructionSnapshot, "exercise"> & {
  exercise: Exercises.VO.Exercise & {
    categoryAssignments: ReadonlyArray<{
      role: Exercises.VO.ExerciseCategoryRoleType;
      category: Exercises.VO.ExerciseCategory;
    }>;
  };
};

type PlanGetViewSection = Omit<VO.PlanSectionSnapshot, "exerciseInstructions"> & {
  exerciseInstructions: Array<PlanGetViewExerciseInstruction>;
};

type PlanGetViewFacts = {
  plan: Omit<VO.PlanSnapshot, "sections"> & { sections: Array<PlanGetViewSection> };
  activeCount: tools.IntegerNonNegativeType;
  categories: ReadonlyArray<Exercises.VO.ExerciseCategory>;
};

export class PlanGetView {
  constructor(private readonly facts: PlanGetViewFacts) {}

  calculate(): Queries.PlanGetResponse {
    const { plan, activeCount, categories } = this.facts;

    const data = {
      ...plan,
      sections: plan.sections.map((section) => ({
        ...section,
        exerciseInstructions: section.exerciseInstructions.map((exerciseInstruction) => {
          const { categoryAssignments, ...exercise } = exerciseInstruction.exercise;

          return {
            ...exerciseInstruction,
            exercise: {
              ...exercise,
              progressionMethods: VO.ProgressionMethodApplicability.options(exercise.resistance),
            },
            actions: new PlanGetExerciseInstructionActions({
              status: plan.status,
              section,
              exerciseInstructionId: exerciseInstruction.id,
            }).calculate(),
          };
        }),
        actions: new PlanGetSectionActions({ status: plan.status, section }).calculate(),
      })),
    };

    const coverage = new PlanCategoryCoverage({
      categories,
      instructions: plan.sections.flatMap((section) =>
        section.exerciseInstructions.map((exerciseInstruction) => ({
          sets: exerciseInstruction.sets,
          categories: exerciseInstruction.exercise.categoryAssignments.map((assignment) => ({
            ...assignment.category,
            role: assignment.role,
          })),
        })),
      ),
    }).calculate();

    return {
      data,
      actions: new PlanGetActions({
        status: plan.status,
        sections: data.sections,
        activeCount,
        coverage,
      }).calculate(),
      coverage,
    };
  }
}
