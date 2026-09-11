import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type {
  PlanExerciseInstruction,
  PlanGetResponse,
  PlanSection,
} from "../../modules/plans/queries/get-plan";
import { ExerciseImage, ExerciseImageSize } from "../components";
import { SetsReps } from "../components/sets-reps";
import { PlanSectionExerciseInstructionExerciseChange } from "./plan-section-exercise-instruction-exercise-change";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";
import { PlanSectionExerciseInstructionUpdate } from "./plan-section-exercise-instruction-update";

export function PlanSectionExerciseInstructionRow(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
  position: number;
}) {
  const update = bg.useToggle({
    name: `plan-section-exercise-instruction-update-${props.exerciseInstruction.id}`,
  });

  const change = bg.useToggle({
    name: `plan-section-exercise-instruction-exercise-change-${props.exerciseInstruction.id}`,
  });

  const { exerciseInstruction } = props;
  const { actions } = exerciseInstruction;

  const controls = actions.update.available || actions.exerciseChange.available || actions.remove.available;

  return (
    <li
      data-bct="alpha-subtle"
      data-bst="solid"
      data-bwt="hairline"
      data-cross="center"
      data-gap="3"
      data-md-wrap="wrap"
      data-py="2"
      data-stack="x"
      data-wrap={update.on ? undefined : "nowrap"}
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

      {change.on && (
        <PlanSectionExerciseInstructionExerciseChange
          exerciseInstruction={exerciseInstruction}
          plan={props.plan}
          section={props.section}
          toggle={change}
        />
      )}

      {change.off && (
        <div
          data-cross="center"
          data-gap="1"
          data-grow="1"
          data-stack="x"
          data-transform="truncate"
          data-wrap="nowrap"
          {...bg.Rhythm().times(0).style.width}
        >
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

          {update.off && actions.exerciseChange.available && (
            <PlanSectionExerciseInstructionExerciseChange
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
              toggle={change}
            />
          )}
        </div>
      )}

      {change.off && !controls && (
        <div
          data-color="neutral-400"
          data-fs="sm"
          data-md-main="end"
          data-md-width="100%"
          data-ml="auto"
          data-shrink="0"
          data-stack="x"
        >
          <SetsReps {...exerciseInstruction} />
        </div>
      )}

      {change.off && controls && (
        <div
          data-cross="center"
          data-gap="2"
          data-md-main={update.on ? undefined : "end"}
          data-md-width="100%"
          data-ml="auto"
          data-shrink="0"
          data-stack="x"
          data-wrap="nowrap"
        >
          {actions.update.available && (
            <PlanSectionExerciseInstructionUpdate
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
              toggle={update}
            />
          )}

          {update.off && actions.remove.available && (
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
