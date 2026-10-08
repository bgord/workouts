import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import { useId } from "react";
import type { PlanExerciseInstruction, PlanSection } from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { LateralityKit } from "../kits/laterality.kit";
import { ResistanceKit } from "../kits/resistance.kit";
import { PlanSectionExerciseInstructionEdit } from "./plan-section-exercise-instruction-edit";
import { PlanSectionExerciseInstructionMove } from "./plan-section-exercise-instruction-move";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";

export function PlanSectionExerciseInstructionRow(props: {
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
  position: number;
}) {
  const t = bg.useTranslations();
  const { exerciseInstruction } = props;
  const label = useId();
  const Resistance = ResistanceKit[exerciseInstruction.exercise.resistance];
  const Laterality = LateralityKit[exerciseInstruction.exercise.laterality];

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

        <div data-cross="baseline" data-stack="x" {...ui.Gap.cluster}>
          <ui.SetsReps
            data-color="neutral-300"
            reps={exerciseInstruction.reps}
            sets={exerciseInstruction.sets}
          />

          {exerciseInstruction.rir !== null && (
            <ui.RirBadge rir={exerciseInstruction.rir} title={t("rir.target.label")} />
          )}
        </div>

        <div data-color="neutral-500" data-fs="xs" data-stack="x" data-wrap="wrap" {...ui.Gap.cluster}>
          <ui.ProgressionMethodBadge method={exerciseInstruction.progression} />
          <Resistance.Badge />
          <Laterality.Badge />
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
