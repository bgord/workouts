import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseDeleteCommandType>;
};

export const ExerciseDelete = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const id = v.parse(Exercises.VO.ExerciseId, c.req.param("exerciseId"));

  const command = bg.command(Exercises.Commands.ExerciseDeleteCommand, { payload: { id } }, deps);

  await deps.CommandBus.emit(command);

  return new Response();
};
