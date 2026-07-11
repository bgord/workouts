import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseImageChangeCommandType>;
};

export const ExerciseImageChange = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const id = v.parse(Exercises.VO.ExerciseId, c.req.param("exerciseId"));
  const body = await c.req.raw.clone().formData();
  const file = body.get("file") as File;

  const filename = tools.Filename.fromString(file.name).withBasename(
    v.parse(tools.Basename, deps.IdProvider.generate()),
  );

  const temporary = await deps.TemporaryFile.write(filename, file);

  const command = bg.command(
    Exercises.Commands.ExerciseImageChangeCommand,
    { payload: { id, absoluteFilePath: temporary.get() } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
