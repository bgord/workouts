import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Exercises from "+exercises";

type Dependencies = { RemoteFileStorage: bg.RemoteFileStoragePort };

export const ExerciseImageGet =
  (deps: Dependencies): bg.EndpointPort =>
  async (context) => {
    const headers = context.request.headers();
    const params = context.request.params();

    const id = v.parse(Exercises.VO.ExerciseId, params["exerciseId"]);

    const key = Exercises.VO.ExerciseImageKeyFactory.stable(id);

    const head = await deps.RemoteFileStorage.head(key);
    if (!head.exists) return new Response(null, { status: 404 });

    const ifNoneMatchHeader = headers.get("if-none-match");

    if (ifNoneMatchHeader && bg.Hash.fromString(ifNoneMatchHeader).matches(head.etag)) {
      return bg.CacheFileMustRevalidate.notModified(head);
    }

    const stream = await deps.RemoteFileStorage.getStream(key);
    if (!stream) return new Response(null, { status: 404 });

    return new Response(stream, { headers: bg.CacheFileMustRevalidate.fresh(head) });
  };
