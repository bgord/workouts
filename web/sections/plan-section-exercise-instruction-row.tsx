import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type {
  PlanExerciseInstruction,
  PlanGetResponse,
  PlanSection,
} from "../../modules/plans/queries/get-plan";
import * as ui from "../components";
import { PlanSectionExerciseInstructionEdit } from "./plan-section-exercise-instruction-edit";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";

export function PlanSectionExerciseInstructionRow(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
  position: number;
}) {
  const { exerciseInstruction } = props;
  const { actions } = exerciseInstruction;

  const editable = actions.update.available || actions.exerciseChange.available;
  const controls = editable || actions.remove.available;

  return (
    <ui.HairlineRow
      data-cross="center"
      data-stack="x"
      data-wrap="nowrap"
      tone="subtle"
      {...ui.Spacing.rowCompact}
    >
      <ui.RowIndex>{props.position}</ui.RowIndex>

      <Link
        aria-hidden
        data-shrink="0"
        params={{ exerciseId: exerciseInstruction.exercise.id }}
        tabIndex={-1}
        to="/catalog/exercise/$exerciseId"
      >
        <ui.ExerciseImage size={ui.ExerciseImageSize.sm} {...exerciseInstruction.exercise} />
      </Link>

      <div data-grow="1" data-stack="y" {...bg.Rhythm().times(0).style.minWidth} {...ui.Gap.inline}>
        <Link
          data-color="neutral-100"
          data-fs="sm"
          data-fw="medium"
          data-hover-color="brand-300"
          data-transform="truncate"
          params={{ exerciseId: exerciseInstruction.exercise.id }}
          title={exerciseInstruction.exercise.name}
          to="/catalog/exercise/$exerciseId"
        >
          {exerciseInstruction.exercise.name}
        </Link>

        {controls && (
          <div data-color="neutral-300" data-fs="sm">
            <ui.SetsReps {...exerciseInstruction} />
          </div>
        )}
      </div>

      {!controls && (
        <div data-color="neutral-300" data-fs="sm" data-shrink="0">
          <ui.SetsReps {...exerciseInstruction} />
        </div>
      )}

      {controls && (
        <div data-cross="center" data-shrink="0" data-stack="x" data-wrap="nowrap" {...ui.Gap.inline}>
          {editable && (
            <PlanSectionExerciseInstructionEdit
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
            />
          )}

          {actions.remove.available && (
            <PlanSectionExerciseInstructionRemove
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
            />
          )}
        </div>
      )}
    </ui.HairlineRow>
  );
}
