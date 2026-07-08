import { createAuthAdapters } from "+infra/adapters/auth";
import { createPreferencesAdapters } from "+infra/adapters/preferences";
import { createSystemAdapters } from "+infra/adapters/system";
import { createEnvironmentLoader } from "+infra/env";
import { createTools } from "+infra/tools";

export async function bootstrap() {
  const EnvironmentLoader = await createEnvironmentLoader();
  const Env = await EnvironmentLoader.load();

  const System = await createSystemAdapters(Env);
  const Tools = await createTools(Env, System);

  const Auth = createAuthAdapters();
  const Preferences = createPreferencesAdapters();

  return { Env, Adapters: { Auth, Preferences, System }, Tools: { ...Tools } };
}

export type BootstrapType = Awaited<ReturnType<typeof bootstrap>>;
