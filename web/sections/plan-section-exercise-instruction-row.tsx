import { Link } from "@tanstack/react-router";
import { useId } from "react";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { ResistanceKit } from "../kits/resistance.kit";
import { PlanSectionExerciseInstructionEdit } from "./plan-section-exercise-instruction-edit";
import { PlanSectionExerciseInstructionMove } from "./plan-section-exercise-instruction-move";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";

export function PlanSectionExerciseInstructionRow(props: {
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
  position: number;
}) {
  const { exerciseInstruction } = props;
  const label = useId();
  const Resistance = ResistanceKit[exerciseInstruction.exercise.resistance];

  return (
    <ui.HairlineRow aria-labelledby={label} data-stack="x" tone="subtle" {...ui.Spacing.rowCompact}>
      <PlanSectionExerciseInstructionMove
        exerciseInstruction={exerciseInstruction}
        position={props.position}
        section={props.section}
      />

      <Link
        aria-hidden
        data-shrink="0"
        params={{ exerciseId: exerciseInstruction.exercise.id }}
        tabIndex={-1}
        to="/catalog/exercise/$exerciseId"
      >
        <ui.ExerciseImage size={ui.ExerciseImageSize.sm} {...exerciseInstruction.exercise} />
      </Link>

      <div data-grow="1" data-minw="0" data-stack="y" {...ui.Gap.inline}>
        <ui.ExerciseLink
          id={label}
          params={{ exerciseId: exerciseInstruction.exercise.id }}
          title={exerciseInstruction.exercise.name}
          to="/catalog/exercise/$exerciseId"
        >
          {exerciseInstruction.exercise.name}
        </ui.ExerciseLink>

        <div data-color="neutral-300" data-stack="x" data-wrap="wrap" {...ui.Gap.inline}>
          <ui.SetsReps {...exerciseInstruction} />
          <ui.ProgressionMethodBadge method={exerciseInstruction.progression} />
          <Resistance.Badge />
        </div>
      </div>

      <div data-shrink="0" data-stack="x" {...ui.Gap.inline}>
        <PlanSectionExerciseInstructionEdit
          exerciseInstruction={exerciseInstruction}
          section={props.section}
        />

        <PlanSectionExerciseInstructionRemove
          exerciseInstruction={exerciseInstruction}
          section={props.section}
        />
      </div>
    </ui.HairlineRow>
  );
}
