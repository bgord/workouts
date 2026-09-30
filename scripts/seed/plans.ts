import * as bg from "@bgord/bun";
import * as v from "valibot";
import type * as Auth from "+auth";
import * as Plans from "+plans";
import type { BootstrapType } from "+infra/bootstrap";

type PlanFixture = {
  id: string;
  name: string;
  description: string;
  sections: Record<
    string,
    {
      id: string;
      name: string;
      warmup?: string;
      instructions: ReadonlyArray<{
        exercise: { id: string };
        sets: number;
        reps: { min: number; max: number };
        progression: string;
      }>;
    }
  >;
};

export async function draftPlan(di: BootstrapType, userId: Auth.VO.UserIdType, plan: PlanFixture) {
  const deps = { ...di.Adapters.System, ...di.Tools };
  const planId = v.parse(Plans.VO.PlanId, plan.id);

  const create = bg.command(
    Plans.Commands.PlanCreateCommand,
    { payload: { id: planId, name: v.parse(Plans.VO.PlanName, plan.name), userId } },
    deps,
  );

  await di.Tools.CommandBus.emit(create);

  const description = bg.command(
    Plans.Commands.PlanDescriptionSetCommand,
    {
      revision: (await di.Adapters.Plans.PlanRepository.load(planId)).revision,
      payload: {
        planId,
        description: v.parse(Plans.VO.PlanDescription, plan.description),
        requesterId: userId,
      },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(description);

  for (const section of Object.values(plan.sections)) {
    const planSectionId = v.parse(Plans.VO.PlanSectionId, section.id);

    const create = bg.command(
      Plans.Commands.PlanSectionCreateCommand,
      {
        revision: (await di.Adapters.Plans.PlanRepository.load(planId)).revision,
        payload: {
          planId,
          planSectionId,
          planSectionName: v.parse(Plans.VO.PlanSectionName, section.name),
          requesterId: userId,
        },
      },
      deps,
    );

    await di.Tools.CommandBus.emit(create);

    if (section.warmup !== undefined) {
      const warmup = bg.command(
        Plans.Commands.PlanSectionWarmupSetCommand,
        {
          revision: (await di.Adapters.Plans.PlanRepository.load(planId)).revision,
          payload: {
            planId,
            planSectionId,
            warmup: v.parse(Plans.VO.PlanSectionWarmup, section.warmup),
            requesterId: userId,
          },
        },
        deps,
      );

      await di.Tools.CommandBus.emit(warmup);
    }

    for (const instruction of section.instructions) {
      const add = bg.command(
        Plans.Commands.PlanSectionExerciseInstructionAddCommand,
        {
          revision: (await di.Adapters.Plans.PlanRepository.load(planId)).revision,
          payload: {
            planId,
            planSectionId,
            exerciseInstruction: v.parse(Plans.VO.ExerciseInstruction, {
              id: deps.IdProvider.generate(),
              exerciseId: instruction.exercise.id,
              sets: instruction.sets,
              reps: instruction.reps,
              progression: instruction.progression,
            }),
            requesterId: userId,
          },
        },
        deps,
      );

      await di.Tools.CommandBus.emit(add);
    }
  }
}

export async function finalizePlan(di: BootstrapType, userId: Auth.VO.UserIdType, plan: PlanFixture) {
  const deps = { ...di.Adapters.System, ...di.Tools };
  const planId = v.parse(Plans.VO.PlanId, plan.id);

  const command = bg.command(
    Plans.Commands.PlanFinalizeCommand,
    {
      revision: (await di.Adapters.Plans.PlanRepository.load(planId)).revision,
      payload: { planId, requesterId: userId },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}

export async function archivePlan(di: BootstrapType, userId: Auth.VO.UserIdType, plan: PlanFixture) {
  const deps = { ...di.Adapters.System, ...di.Tools };
  const planId = v.parse(Plans.VO.PlanId, plan.id);

  const command = bg.command(
    Plans.Commands.PlanArchiveCommand,
    {
      revision: (await di.Adapters.Plans.PlanRepository.load(planId)).revision,
      payload: { planId, requesterId: userId },
    },
    deps,
  );

  await di.Tools.CommandBus.emit(command);
}
