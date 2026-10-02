import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";

export class PlanReport {
  static create(plan: PlanGetResponse["data"]) {
    const sections = plan.sections.flatMap((section) => [
      "",
      `## ${section.name}`,
      ...section.exerciseInstructions.map(
        (instruction) =>
          `- ${instruction.exercise.name}: ${instruction.sets} x ${instruction.reps.min === instruction.reps.max ? instruction.reps.min : `${instruction.reps.min}-${instruction.reps.max}`}, ${instruction.progression}`,
      ),
    ]);

    return [`# Plan: ${plan.name}`, ...(plan.description ? ["", plan.description] : []), ...sections].join(
      "\n",
    );
  }
}
