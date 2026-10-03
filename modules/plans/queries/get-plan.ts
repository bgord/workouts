import type * as bg from "@bgord/bun";
import type * as Auth from "+auth";
import type * as VO from "+plans/value-objects";

export type PlanSectionActions = { exerciseInstructionAdd: bg.ActionState };

export type ExerciseInstructionActions = {
  update: bg.ActionState;
  exerciseChange: bg.ActionState;
  moveUp: bg.ActionState;
  moveDown: bg.ActionState;
  remove: bg.ActionState;
};

export type PlanExerciseInstruction = VO.ExerciseInstructionSnapshot & {
  actions: ExerciseInstructionActions;
};

export type PlanSection = Omit<VO.PlanSectionSnapshot, "exerciseInstructions"> & {
  exerciseInstructions: Array<PlanExerciseInstruction>;
  actions: PlanSectionActions;
};

export type PlanGetResponse = {
  data: Omit<VO.PlanSnapshot, "sections"> & { sections: Array<PlanSection> };
  actions: {
    finalize: bg.ActionState;
    rename: bg.ActionState;
    descriptionSet: bg.ActionState;
    editingEnable: bg.ActionState;
    archive: bg.ActionState;
    restore: bg.ActionState;
    remove: bg.ActionState;
    sectionCreate: bg.ActionState;
    sectionRename: bg.ActionState;
    sectionWarmupSet: bg.ActionState;
    sectionCooldownSet: bg.ActionState;
    sectionRemove: bg.ActionState;
  };
};

export interface GetPlan {
  execute(planId: VO.PlanIdType, userId: Auth.VO.UserIdType): Promise<PlanGetResponse | null>;
}
