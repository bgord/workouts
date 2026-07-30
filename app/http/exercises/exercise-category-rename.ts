import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  CommandBus: bg.CommandBusPort<Exercises.Commands.ExerciseCategoryRenameCommandType>;
};

export const ExerciseCategoryRename = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const context = new bg.RequestContextHonoAdapter(c);
  const body = await context.request.json();
  const params = context.request.params();

  const id = v.parse(Exercises.VO.ExerciseCategoryId, params["exerciseCategoryId"]);
  const name = v.parse(Exercises.VO.ExerciseCategoryName, body["name"]);

  const command = bg.command(
    Exercises.Commands.ExerciseCategoryRenameCommand,
    { payload: { id, name } },
    deps,
  );

  await deps.CommandBus.emit(command);

  return new Response();
};
