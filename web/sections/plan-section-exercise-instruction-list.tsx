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
      <div data-color="neutral-400" data-fs="sm">
        {t("plan.section.exercise.list.empty")}
      </div>
    );
  }

  return (
    <ul
      data-bct="alpha-subtle"
      data-bst="solid"
      data-bwt="hairline"
      data-gap="2"
      data-pt="3"
      data-stack="y"
      data-width="100%"
    >
      {props.section.exerciseInstructions.map((exerciseInstruction) => (
        <PlanSectionExerciseInstructionRow
          exerciseInstruction={exerciseInstruction}
          key={exerciseInstruction.id}
          plan={props.plan}
          section={props.section}
        />
      ))}
    </ul>
  );
}
