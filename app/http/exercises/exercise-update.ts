import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseUpdateCommandType>;
};

export const ExerciseUpdate = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.json();

  const id = v.parse(Exercises.VO.ExerciseId, c.req.param("exerciseId"));
  const name = v.parse(Exercises.VO.ExerciseName, body.get("name"));
  const description = v.parse(Exercises.VO.ExerciseDescription, body.get("description"));

  const command = bg.command(
    Exercises.Commands.ExerciseUpdateCommand,
    { payload: { id, name, description } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
