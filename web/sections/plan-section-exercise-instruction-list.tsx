import { useTranslations } from "@bgord/ui";
import { Link } from "@tanstack/react-router";
import type { Plan, PlanSectionWithExercises } from "../../modules/plans/value-objects/plan";
import { PlanStatusEnum } from "../../modules/plans/value-objects/plan-status";
import type { RepsType } from "../../modules/plans/value-objects/reps";
import { ExerciseImage, ExerciseImageSize } from "../components";
import { PlanSectionExerciseInstructionRemove } from "./plan-section-exercise-instruction-remove";

function format(reps: RepsType): string {
  return reps.min === reps.max ? String(reps.min) : `${reps.min}-${reps.max}`;
}

export function PlanSectionExerciseInstructionList(props: { plan: Plan; section: PlanSectionWithExercises }) {
  const t = useTranslations();

  const editable = props.plan.status === PlanStatusEnum.draft;

  if (props.section.exerciseInstructions.length === 0) {
    return (
      <div data-color="neutral-500" data-fs="sm">
        {t("plan.section.exercise.list.empty")}
      </div>
    );
  }

  return (
    <ul data-gap="2" data-stack="y" data-width="100%">
      {props.section.exerciseInstructions.map((exerciseInstruction) => (
        <li data-cross="center" data-gap="3" data-stack="x" key={exerciseInstruction.id}>
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

          <div data-color="neutral-300" data-fs="sm" data-ml="auto">
            {t("plan.section.exercise.instruction", {
              sets: exerciseInstruction.sets,
              reps: format(exerciseInstruction.reps),
            })}
          </div>

          {editable && (
            <PlanSectionExerciseInstructionRemove
              exerciseInstruction={exerciseInstruction}
              plan={props.plan}
              section={props.section}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
