import * as v from "valibot";

export const WebAssets = v.object({
  entry: v.string(),
  preloads: v.record(v.string(), v.array(v.string())),
});

export type WebAssetsType = v.InferOutput<typeof WebAssets>;
