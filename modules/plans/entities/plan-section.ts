import type * as Exercises from "+exercises";
import * as Invariants from "+plans/invariants";
import type * as VO from "+plans/value-objects";

export class PlanSection implements VO.PlanSection {
  warmup?: VO.PlanSectionWarmupType;
  cooldown?: VO.PlanSectionCooldownType;
  exerciseInstructions: Array<VO.ExerciseInstructionType> = [];

  constructor(
    readonly id: VO.PlanSectionIdType,
    public name: VO.PlanSectionNameType,
  ) {}

  guardRename(name: VO.PlanSectionNameType) {
    Invariants.PlanSectionNameHasChanged.enforce({ current: this.name, incoming: name });
  }

  guardWarmupSet(warmup: VO.PlanSectionWarmupType | undefined) {
    Invariants.PlanSectionWarmupHasChanged.enforce({ current: this.warmup, incoming: warmup });
  }

  guardCooldownSet(cooldown: VO.PlanSectionCooldownType | undefined) {
    Invariants.PlanSectionCooldownHasChanged.enforce({ current: this.cooldown, incoming: cooldown });
  }

  guardInstructionAdd(exerciseInstruction: VO.ExerciseInstructionType) {
    Invariants.PlanSectionExerciseInstructionLimit.enforce({ planSection: this });
    Invariants.PlanSectionExerciseInstructionProgressionIsApplicableForReps.enforce(exerciseInstruction);
    Invariants.PlanSectionExerciseInstructionRirIsApplicableForReps.enforce(exerciseInstruction);
  }

  guardInstructionExists(exerciseInstructionId: VO.ExerciseInstructionIdType) {
    Invariants.PlanSectionExerciseInstructionExists.enforce({ planSection: this, exerciseInstructionId });
  }

  guardInstructionUpdate(exerciseInstruction: VO.ExerciseInstructionType) {
    this.guardInstructionExists(exerciseInstruction.id);
    if (!this.instructionExerciseChanged(exerciseInstruction)) {
      Invariants.PlanSectionExerciseInstructionHasChanged.enforce({
        current: this.instruction(exerciseInstruction.id),
        incoming: exerciseInstruction,
      });
    }
    Invariants.PlanSectionExerciseInstructionProgressionIsApplicableForReps.enforce(exerciseInstruction);
    Invariants.PlanSectionExerciseInstructionRirIsApplicableForReps.enforce(exerciseInstruction);
  }

  guardInstructionMove(
    exerciseInstructionId: VO.ExerciseInstructionIdType,
    position: VO.ExerciseInstructionPositionType,
  ) {
    this.guardInstructionExists(exerciseInstructionId);
    Invariants.PlanSectionExerciseInstructionPositionInRange.enforce({ planSection: this, position });
    Invariants.PlanSectionExerciseInstructionPositionHasChanged.enforce({
      planSection: this,
      exerciseInstructionId,
      position,
    });
  }

  rename(name: VO.PlanSectionNameType) {
    this.name = name;
  }

  setWarmup(warmup: VO.PlanSectionWarmupType | undefined) {
    this.warmup = warmup;
  }

  setCooldown(cooldown: VO.PlanSectionCooldownType | undefined) {
    this.cooldown = cooldown;
  }

  addInstruction(exerciseInstruction: VO.ExerciseInstructionType) {
    this.exerciseInstructions = [...this.exerciseInstructions, exerciseInstruction];
  }

  removeInstruction(exerciseInstructionId: VO.ExerciseInstructionIdType) {
    this.exerciseInstructions = this.exerciseInstructions.filter(
      (exerciseInstruction) => exerciseInstruction.id !== exerciseInstructionId,
    );
  }

  updateInstruction(updated: Omit<VO.ExerciseInstructionType, "exerciseId">) {
    this.exerciseInstructions = this.exerciseInstructions.map((exerciseInstruction) =>
      exerciseInstruction.id === updated.id
        ? {
            ...exerciseInstruction,
            reps: updated.reps,
            sets: updated.sets,
            progression: updated.progression,
            rir: updated.rir,
          }
        : exerciseInstruction,
    );
  }

  changeInstructionExercise(
    exerciseInstructionId: VO.ExerciseInstructionIdType,
    exerciseId: Exercises.VO.ExerciseIdType,
  ) {
    this.exerciseInstructions = this.exerciseInstructions.map((exerciseInstruction) =>
      exerciseInstruction.id === exerciseInstructionId
        ? { ...exerciseInstruction, exerciseId }
        : exerciseInstruction,
    );
  }

  moveInstruction(
    exerciseInstructionId: VO.ExerciseInstructionIdType,
    position: VO.ExerciseInstructionPositionType,
  ) {
    const moved = this.instruction(exerciseInstructionId);
    const others = this.exerciseInstructions.filter(
      (exerciseInstruction) => exerciseInstruction.id !== exerciseInstructionId,
    );

    if (moved) others.splice(position, 0, moved);

    this.exerciseInstructions = others;
  }

  instructionExerciseChanged(exerciseInstruction: Pick<VO.ExerciseInstructionType, "id" | "exerciseId">) {
    return this.instruction(exerciseInstruction.id)?.exerciseId !== exerciseInstruction.exerciseId;
  }

  instructionPrescriptionChanged(exerciseInstruction: VO.ExerciseInstructionType) {
    return Invariants.PlanSectionExerciseInstructionHasChanged.passes({
      current: this.instruction(exerciseInstruction.id),
      incoming: exerciseInstruction,
    });
  }

  private instruction(exerciseInstructionId: VO.ExerciseInstructionIdType) {
    return this.exerciseInstructions.find(
      (exerciseInstruction) => exerciseInstruction.id === exerciseInstructionId,
    );
  }
}
