import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type {
  PlanExerciseInstruction,
  PlanGetResponse,
  PlanSection,
} from "../../modules/plans/queries/get-plan";
import { ExerciseImage, ExerciseImageSize } from "../components";
import { SetsReps } from "../components/sets-reps";
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
    <li
      data-bct="alpha-subtle"
      data-bst="solid"
      data-bwt="hairline"
      data-cross="center"
      data-gap="3"
      data-py="2"
      data-stack="x"
      data-ml="3"
      data-md-ml="0"
      data-wrap="nowrap"
    >
      <div data-color="neutral-600" data-fs="xs" data-transform="font-variant-numeric">
        {props.position}
      </div>

      <Link
        aria-hidden
        data-shrink="0"
        params={{ exerciseId: exerciseInstruction.exercise.id }}
        tabIndex={-1}
        to="/catalog/exercise/$exerciseId"
      >
        <ExerciseImage size={ExerciseImageSize.sm} {...exerciseInstruction.exercise} />
      </Link>

      <div data-gap="1" data-grow="1" data-stack="y" {...bg.Rhythm().times(0).style.minWidth}>
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
            <SetsReps {...exerciseInstruction} />
          </div>
        )}
      </div>

      {!controls && (
        <div data-color="neutral-300" data-fs="sm" data-shrink="0">
          <SetsReps {...exerciseInstruction} />
        </div>
      )}

      {controls && (
        <div data-cross="center" data-gap="1" data-shrink="0" data-stack="x" data-wrap="nowrap">
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
    </li>
  );
}
