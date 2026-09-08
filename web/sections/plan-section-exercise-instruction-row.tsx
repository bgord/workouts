import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type {
  PlanExerciseInstruction,
  PlanGetResponse,
  PlanSection,
} from "../../modules/plans/queries/get-plan";
import type { RepsType } from "../../modules/plans/value-objects/reps";
import { ExerciseImage, ExerciseImageSize } from "../components";
import { PlanSectionExerciseInstructionExerciseChange } from "./plan-section-exercise-instruction-exercise-change";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";
import { PlanSectionExerciseInstructionUpdate } from "./plan-section-exercise-instruction-update";

function format(reps: RepsType): string {
  return reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`;
}

export function PlanSectionExerciseInstructionRow(props: {
  plan: PlanGetResponse["data"];
  section: PlanSection;
  exerciseInstruction: PlanExerciseInstruction;
}) {
  const t = bg.useTranslations();

  const update = bg.useToggle({
    name: `plan-section-exercise-instruction-update-${props.exerciseInstruction.id}`,
  });

  const change = bg.useToggle({
    name: `plan-section-exercise-instruction-exercise-change-${props.exerciseInstruction.id}`,
  });

  const { exerciseInstruction } = props;
  const { actions } = exerciseInstruction;

  const controls = actions.update.available || actions.exerciseChange.available || actions.remove.available;

  const instruction = t("plan.section.exercise.instruction", {
    sets: exerciseInstruction.sets,
    reps: format(exerciseInstruction.reps),
  });

  return (
    <li data-cross="center" data-gap="3" data-stack="x">
      <Link
        aria-hidden
        params={{ exerciseId: exerciseInstruction.exercise.id }}
        tabIndex={-1}
        to="/catalog/exercise/$exerciseId"
      >
        <ExerciseImage exercise={exerciseInstruction.exercise} size={ExerciseImageSize.sm} />
      </Link>

      <Link
        data-color="neutral-100"
        data-fs="sm"
        data-fw="medium"
        data-grow="1"
        data-hover-color="brand-300"
        data-transform="truncate"
        params={{ exerciseId: exerciseInstruction.exercise.id }}
        title={exerciseInstruction.exercise.name}
        to="/catalog/exercise/$exerciseId"
      >
        {exerciseInstruction.exercise.name}
      </Link>

      {!controls && (
        <div data-color="neutral-400" data-fs="sm" data-ml="auto">
          {instruction}
        </div>
      )}

      {controls && (
        <div data-cross="center" data-gap="3" data-ml="auto" data-stack="x">
          {change.off && actions.update.available && (
            <PlanSectionExerciseInstructionUpdate
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
              toggle={update}
            >
              {instruction}
            </PlanSectionExerciseInstructionUpdate>
          )}

          {update.off && actions.exerciseChange.available && (
            <PlanSectionExerciseInstructionExerciseChange
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
              toggle={change}
            />
          )}

          {update.off && change.off && actions.remove.available && (
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
