import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseAssignCategoryCommandType>;
};

export const ExerciseAssignCategory = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.json();

  const exerciseId = v.parse(Exercises.VO.ExerciseId, body.exerciseId);
  const exerciseCategoryId = v.parse(Exercises.VO.ExerciseCategoryId, body.exerciseCategoryId);

  const command = bg.command(
    Exercises.Commands.ExerciseAssignCategoryCommand,
    { payload: { exerciseId, exerciseCategoryId } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
