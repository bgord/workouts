import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import type { EnvironmentResultType } from "+infra/env";
import { WebAssets } from "./web-assets.vo";

type Dependencies = { Clock: bg.ClockPort; FileReaderJson: bg.FileReaderJsonPort };

const BuildInfo = v.object({ ...bg.BuildInfo.entries, assets: WebAssets });

export type BuildInfoType = v.InferOutput<typeof BuildInfo>;

export function createBuildInfoConfig(
  Env: EnvironmentResultType,
  deps: Dependencies,
): bg.ReactiveConfigPort<BuildInfoType> {
  const noop = new bg.ReactiveConfigNoopAdapter<BuildInfoType>(BuildInfo, {
    timestamp: tools.Timestamp.fromNumber(1767775662000).ms,
    version: v.parse(tools.PackageVersionSchema, "v1.0.0"),
    sha: bg.CommitSha.fromString("a".repeat(40)).value,
    size: tools.Size.fromBytes(0).toBytes(),
    assets: { entry: "/public/entry-client.js", preloads: {} },
  });

  return {
    [bg.NodeEnvironmentEnum.local]: noop,
    [bg.NodeEnvironmentEnum.test]: noop,
    [bg.NodeEnvironmentEnum.staging]: noop,
    [bg.NodeEnvironmentEnum.production]: new bg.ReactiveConfigFileJsonAdapter<BuildInfoType>(
      bg.BUILD_INFO_FILE_PATH,
      BuildInfo,
      deps,
    ),
  }[Env.type];
}
