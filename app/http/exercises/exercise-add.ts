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
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseAddCommandType>;
};

export const ExerciseAdd = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const form = await context.request.form();

  const file = form.get("file") as File;

  const filename = tools.Filename.fromString(file.name).withBasename(
    v.parse(tools.Basename, deps.IdProvider.generate()),
  );

  const id = v.parse(Exercises.VO.ExerciseId, deps.IdProvider.generate());
  const name = v.parse(Exercises.VO.ExerciseName, form.get("name"));
  const description = v.parse(Exercises.VO.ExerciseDescription, form.get("description"));

  const temporary = await deps.TemporaryFile.write(filename, file);

  const command = bg.command(
    Exercises.Commands.ExerciseAddCommand,
    { payload: { id, absoluteFilePath: temporary.get(), name, description } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
