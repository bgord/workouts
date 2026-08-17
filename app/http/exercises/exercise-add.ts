import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseAddCommandType>;
};

export const ExerciseAdd =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const form = await context.request.form();

    const file = v.parse(v.instance(File), form.get("file"));

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
