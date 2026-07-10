import type * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = {
  IdProvider: bg.IdProviderPort;
  Clock: bg.ClockPort;
  TemporaryFile: bg.TemporaryFilePort;
};

export const ExerciseAdd = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const body = await c.req.raw.clone().formData();
  const file = body.get("file") as File;

  const filename = tools.Filename.fromString(file.name).withBasename(
    v.parse(tools.Basename, deps.IdProvider.generate()),
  );

  const id = v.parse(Exercises.VO.ExerciseId, deps.IdProvider.generate());
  const name = v.parse(Exercises.VO.ExerciseName, body.get("name"));
  const description = v.parse(Exercises.VO.ExerciseDescription, body.get("description"));

  const temporary = await deps.TemporaryFile.write(filename, file);

  return new Response();
};
