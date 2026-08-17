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
  const context = new bg.RequestContextHonoAdapter(c);
  const params = context.request.params();
  const form = await context.request.form();

  const id = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);
  const file = v.parse(v.instance(File), form.get("file"));

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
