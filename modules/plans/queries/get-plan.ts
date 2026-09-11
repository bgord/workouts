import type { ActionState } from "+action-state";
import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export type PlanSectionActions = { exerciseInstructionAdd: ActionState };

export type ExerciseInstructionActions = {
  update: ActionState;
  exerciseChange: ActionState;
  remove: ActionState;
};

export type PlanExerciseInstruction = VO.ExerciseInstructionWithExercise & {
  actions: ExerciseInstructionActions;
};

export type PlanSection = Omit<VO.PlanSectionWithExercises, "exerciseInstructions"> & {
  exerciseInstructions: Array<PlanExerciseInstruction>;
  actions: PlanSectionActions;
};

export type PlanGetResponse = {
  data: Omit<VO.Plan, "sections"> & { sections: Array<PlanSection> };
  actions: {
    finalize: ActionState;
    rename: ActionState;
    descriptionSet: ActionState;
    editingEnable: ActionState;
    archive: ActionState;
    restore: ActionState;
    remove: ActionState;
    sectionCreate: ActionState;
    sectionRename: ActionState;
    sectionRemove: ActionState;
  };
};

export interface GetPlan {
  execute(planId: VO.PlanIdType, userId: Auth.VO.UserIdType): Promise<PlanGetResponse | null>;
}
