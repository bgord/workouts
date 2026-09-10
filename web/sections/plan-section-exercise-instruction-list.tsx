import { useTranslations } from "@bgord/ui";
import type { PlanGetResponse, PlanSection } from "../../modules/plans/queries/get-plan";
import { PlanSectionExerciseInstructionRow } from "./plan-section-exercise-instruction-row";

export function PlanSectionExerciseInstructionList(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
}) {
  const t = useTranslations();

  if (props.section.exerciseInstructions.length === 0) {
    return (
      <div
        data-bct="alpha-subtle"
        data-bst="solid"
        data-bwt="hairline"
        data-color="neutral-500"
        data-fs="sm"
        data-main="center"
        data-py="5"
        data-stack="x"
      >
        {t("plan.section.exercise.list.empty")}
      </div>
    );
  }

  return (
    <ul data-stack="y" data-width="100%">
      {props.section.exerciseInstructions.map((exerciseInstruction, position) => (
        <PlanSectionExerciseInstructionRow
          exerciseInstruction={exerciseInstruction}
          key={exerciseInstruction.id}
          plan={props.plan}
          position={position + 1}
          section={props.section}
        />
      ))}
    </ul>
  );
}
