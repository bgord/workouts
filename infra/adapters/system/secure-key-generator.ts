import * as bg from "@bgord/bun";
import type { EnvironmentResultType } from "+infra/env";

export function createSecureKeyGenerator(Env: EnvironmentResultType): bg.SecureKeyGeneratorPort {
  const SecureKeyGenerator = new bg.SecureKeyGeneratorNoopAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: SecureKeyGenerator,
    [bg.NodeEnvironmentEnum.test]: SecureKeyGenerator,
    [bg.NodeEnvironmentEnum.staging]: SecureKeyGenerator,
    [bg.NodeEnvironmentEnum.production]: new bg.SecureKeyGeneratorCryptoAdapter(),
  }[Env.type];
}
