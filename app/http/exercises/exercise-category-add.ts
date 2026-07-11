import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseCategoryAddCommandType>;
};

export const ExerciseCategoryAdd = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.json();

  const id = v.parse(Exercises.VO.ExerciseCategoryId, deps.IdProvider.generate());
  const name = v.parse(Exercises.VO.ExerciseCategoryName, body.name);

  const command = bg.command(Exercises.Commands.ExerciseCategoryAddCommand, { payload: { id, name } }, deps);

  await deps.CommandBus.emit(command);

  return new Response();
};
