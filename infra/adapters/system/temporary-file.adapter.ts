import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as v from "valibot";
import { name } from "+infra/config";
import type { EnvironmentResultType } from "+infra/env";

type Dependencies = {
  AtomicFileWriter: bg.AtomicFileWriterPort;
  FileCleaner: bg.FileCleanerPort;
};

export function createTemporaryFile(Env: EnvironmentResultType, deps: Dependencies): bg.TemporaryFilePort {
  const local = v.parse(tools.DirectoryPathAbsoluteSchema, `${__dirname}/tmp`);
  const production = v.parse(tools.DirectoryPathAbsoluteSchema, `/var/www/${name}/infra/tmp`);

  return {
    [bg.NodeEnvironmentEnum.local]: new bg.TemporaryFileAbsoluteAdapter(local, deps),
    [bg.NodeEnvironmentEnum.test]: new bg.TemporaryFileNoopAdapter(local),
    [bg.NodeEnvironmentEnum.staging]: new bg.TemporaryFileAbsoluteAdapter(local, deps),
    [bg.NodeEnvironmentEnum.production]: new bg.TemporaryFileAbsoluteAdapter(production, deps),
  }[Env.type];
}
