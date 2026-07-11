import * as bg from "@bgord/bun";
import type hono from "hono";
import * as v from "valibot";
import * as Exercises from "+exercises";
import type * as infra from "+infra";

type Dependencies = { RemoteFileStorage: bg.RemoteFileStoragePort };

export const ExerciseImageGet = (deps: Dependencies) => async (c: hono.Context<infra.Config>) => {
  const id = v.parse(Exercises.VO.ExerciseId, c.req.param("exerciseId"));
  const key = Exercises.VO.ExerciseImageKeyFactory.stable(id);

  const head = await deps.RemoteFileStorage.head(key);
  if (!head.exists) return c.notFound();

  const ifNoneMatchHeader = c.req.header("if-none-match");

  if (ifNoneMatchHeader && bg.Hash.fromString(ifNoneMatchHeader).matches(head.etag)) {
    return bg.CacheFileMustRevalidate.notModified(head);
  }

  const stream = await deps.RemoteFileStorage.getStream(key);
  if (!stream) return c.notFound();

  return new Response(stream, { headers: bg.CacheFileMustRevalidate.fresh(head) });
};
