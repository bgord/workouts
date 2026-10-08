import type { PlanGetResponse } from "../../modules/plans/queries/get-plan";
import { RepsScheme } from "../../modules/plans/value-objects/reps-scheme";
import { RepsSchemeFormat } from "../kits/reps-scheme.format";

export class PlanReport {
  static create(plan: PlanGetResponse["data"]) {
    const sections = plan.sections.flatMap((section) => [
      "",
      `## ${section.name}`,
      ...section.exerciseInstructions.map(
        (instruction) =>
          `- ${instruction.exercise.name}: ${instruction.sets} x ${RepsSchemeFormat[RepsScheme.of(instruction.reps)].prescription(instruction.reps)}${instruction.rir === null ? "" : ` @ RIR ${instruction.rir}`}, ${instruction.progression}`,
      ),
    ]);

    return [`# Plan: ${plan.name}`, ...(plan.description ? ["", plan.description] : []), ...sections].join(
      "\n",
    );
  }
}
