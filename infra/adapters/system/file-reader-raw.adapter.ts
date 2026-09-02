import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createFileReaderRaw(Env: EnvironmentResultType): bg.FileReaderRawPort {
  const FileReaderRaw = new bg.FileReaderRawAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: FileReaderRaw,
    [bg.NodeEnvironmentEnum.test]: new bg.FileReaderRawNoopAdapter(new ArrayBuffer(0)),
    [bg.NodeEnvironmentEnum.staging]: FileReaderRaw,
    [bg.NodeEnvironmentEnum.production]: FileReaderRaw,
  }[Env.type];
}
