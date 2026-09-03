import * as bg from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type {
  ExerciseInstructionWithExercise,
  Plan,
  PlanSectionWithExercises,
} from "../../modules/plans/value-objects/plan";
import type { RepsType } from "../../modules/plans/value-objects/reps";
import { ExerciseImage, ExerciseImageSize } from "../components";
import { PlanSectionExerciseInstructionExerciseChange } from "./plan-section-exercise-instruction-exercise-change";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";
import { PlanSectionExerciseInstructionUpdate } from "./plan-section-exercise-instruction-update";

function format(reps: RepsType): string {
  return reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`;
}

export function PlanSectionExerciseInstructionRow(props: {
  plan: Plan;
  section: PlanSectionWithExercises;
  exerciseInstruction: ExerciseInstructionWithExercise;
  editable: boolean;
}) {
  const t = bg.useTranslations();

  const update = bg.useToggle({
    name: `plan-section-exercise-instruction-update-${props.exerciseInstruction.id}`,
  });

  const change = bg.useToggle({
    name: `plan-section-exercise-instruction-exercise-change-${props.exerciseInstruction.id}`,
  });

  const { editable, exerciseInstruction } = props;

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
        to="/workbook/exercise/$exerciseId"
      >
        <ExerciseImage exercise={exerciseInstruction.exercise} size={ExerciseImageSize.sm} />
      </Link>

      <Link
        className="c-link"
        data-maxw="100%"
        data-transform="truncate"
        params={{ exerciseId: exerciseInstruction.exercise.id }}
        title={exerciseInstruction.exercise.name}
        to="/workbook/exercise/$exerciseId"
      >
        {exerciseInstruction.exercise.name}
      </Link>

      {!editable && (
        <div data-color="neutral-300" data-fs="sm" data-ml="auto">
          {instruction}
        </div>
      )}

      <div data-cross="center" data-gap="3" data-ml="auto" data-stack="x">
        {editable && change.off && (
          <PlanSectionExerciseInstructionUpdate
            exerciseInstruction={exerciseInstruction}
            plan={props.plan}
            section={props.section}
            toggle={update}
          >
            {instruction}
          </PlanSectionExerciseInstructionUpdate>
        )}

        {editable && update.off && (
          <PlanSectionExerciseInstructionExerciseChange
            exerciseInstruction={exerciseInstruction}
            plan={props.plan}
            section={props.section}
            toggle={change}
          />
        )}

        {editable && update.off && change.off && (
          <PlanSectionExerciseInstructionRemove
            exerciseInstruction={exerciseInstruction}
            plan={props.plan}
            section={props.section}
          />
        )}
      </div>
    </li>
  );
}
